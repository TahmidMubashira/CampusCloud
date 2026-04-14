<?php
namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Resource;
use App\Models\Notification;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // GET /api/resources/{id}/comments — public
    public function index($resourceId)
    {
        $comments = Comment::with(['user', 'replies.user'])
            ->where('resource_id', $resourceId)
            ->whereNull('parent_id')
            ->latest()
            ->get();

        return response()->json([
            'success'  => true,
            'comments' => $comments->map(fn($c) => [
                'id'         => $c->id,
                'body'       => $c->body,
                'user'       => $c->user->name,
                'user_id'    => (int) $c->user_id,
                'timeAgo'    => $c->created_at->diffForHumans(),
                'replyCount' => $c->replies->count(),
                'replies'    => $c->replies->map(fn($r) => [
                    'id'      => $r->id,
                    'body'    => $r->body,
                    'user'    => $r->user->name,
                    'user_id' => (int) $r->user_id,
                    'timeAgo' => $r->created_at->diffForHumans(),
                ]),
            ]),
        ]);
    }

    // POST /api/resources/{id}/comments — auth required
    public function store(Request $request, $resourceId)
    {
        $request->validate([
            'body'      => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $resource = Resource::where('id', $resourceId)
            ->where('status', 'approved')
            ->firstOrFail();

        $comment = Comment::create([
            'resource_id' => $resource->id,
            'user_id'     => $request->user()->id,
            'parent_id'   => $request->parent_id ?? null,
            'body'        => $request->body,
        ]);

        $comment->load('user');

        // ── Notification logic ──────────────────────────────────────────────
        if ($request->parent_id) {
            // Reply — notify the original commenter
            $parentComment = Comment::find($request->parent_id);
            if ($parentComment && $parentComment->user_id !== $request->user()->id) {
                Notification::create([
                    'user_id'     => $parentComment->user_id,
                    'type'        => 'new_reply',
                    'message'     => $request->user()->name . ' replied to your comment on "' . $resource->title . '"',
                    'resource_id' => $resource->id,
                    'is_read'     => 0,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        } else {
            // Top-level comment — notify the resource uploader
            if ($resource->user_id !== $request->user()->id) {
                Notification::create([
                    'user_id'     => $resource->user_id,
                    'type'        => 'new_comment',
                    'message'     => $request->user()->name . ' commented on your resource "' . $resource->title . '"',
                    'resource_id' => $resource->id,
                    'is_read'     => 0,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'comment' => [
                'id'      => $comment->id,
                'body'    => $comment->body,
                'user'    => $comment->user->name,
                'user_id' => (int) $comment->user_id,
                'timeAgo' => $comment->created_at->diffForHumans(),
                'replies' => [],
            ],
        ]);
    }

    // DELETE /api/comments/{id} — auth required
    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ((int)$comment->user_id !== (int)$request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        // Delete replies first to avoid FK constraint on parent_id
        Comment::where('parent_id', $comment->id)->delete();

        $comment->delete();

        return response()->json(['success' => true]);
    }
}