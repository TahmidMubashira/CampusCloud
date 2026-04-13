<?php
namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Resource;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // GET /api/resources/{id}/comments
    public function index($resourceId)
    {
        // JOIN: comments with user names, aggregate reply count
        $comments = Comment::with(['user', 'replies.user'])
            ->where('resource_id', $resourceId)
            ->whereNull('parent_id')  // top-level only
            ->latest()
            ->get();

        return response()->json([
            'success'  => true,
            'comments' => $comments->map(fn($c) => [
                'id'         => $c->id,
                'body'       => $c->body,
                'user'       => $c->user->name,
                'user_id'    => $c->user_id,
                'timeAgo'    => $c->created_at->diffForHumans(),
                'replyCount' => $c->replies->count(),
                'replies'    => $c->replies->map(fn($r) => [
                    'id'      => $r->id,
                    'body'    => $r->body,
                    'user'    => $r->user->name,
                    'user_id' => $r->user_id,
                    'timeAgo' => $r->created_at->diffForHumans(),
                ]),
            ]),
        ]);
    }

    // POST /api/resources/{id}/comments
    public function store(Request $request, $resourceId)
    {
        $request->validate([
            'body'      => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Make sure the resource exists and is approved
        $resource = Resource::where('id', $resourceId)
            ->where('status', 'approved')
            ->firstOrFail();

        $comment = Comment::create([
            'resource_id' => $resource->id,
            'user_id'     => $request->user()->id,
            'parent_id'   => $request->parent_id ?? null,
            'body'        => $request->body,
        ]);

        // Load user for response
        $comment->load('user');

        return response()->json([
            'success' => true,
            'comment' => [
                'id'      => $comment->id,
                'body'    => $comment->body,
                'user'    => $comment->user->name,
                'user_id' => $comment->user_id,
                'timeAgo' => $comment->created_at->diffForHumans(),
                'replies' => [],
            ],
        ]);
    }

    // DELETE /api/comments/{id}
    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Only the comment owner can delete
        if ((int)$comment->user_id !== (int)$request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $comment->delete();

        return response()->json(['success' => true]);
    }
}