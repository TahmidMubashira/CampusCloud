<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->latest()
            ->take(20)
            ->get();

        return response()->json([
            'success'       => true,
            'notifications' => $notifications->map(fn($n) => [
                'id'          => $n->id,
                'type'        => $n->type,
                'message'     => $n->message,
                'resource_id' => $n->resource_id,
                'is_read'     => (bool) $n->is_read,
                'timeAgo'     => $n->created_at->diffForHumans(),
            ]),
            'unreadCount' => Notification::where('user_id', $request->user()->id)
                ->where('is_read', 0)->count(),
        ]);
    }

    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', 0)
            ->update(['is_read' => 1]);

        return response()->json(['success' => true]);
    }
}