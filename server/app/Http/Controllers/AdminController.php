<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Resource;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Admin Login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid admin credentials.',
            ], 401);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Admin login successful.',
            'token'   => $token,
            'admin'   => [
                'id'    => $admin->admin_id,
                'name'  => $admin->name,
                'email' => $admin->email,
                'role'  => 'admin',
            ],
        ]);
    }

    // Admin Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out.']);
    }

    // Get pending resources
    public function pending()
    {
        $resources = Resource::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json([
            'success'   => true,
            'resources' => $resources->map(function($r) {
                return [
                    'id'         => $r->id,
                    'title'      => $r->title,
                    'department' => $r->department,
                    'courseCode' => $r->courseCode,
                    'fileType'   => $r->file_type,
                    'uploadedBy' => $r->user->name,
                    'timeAgo'    => $r->created_at->diffForHumans(),
                ];
            }),
        ]);
    }

    // Approve resource
    public function approve($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->update([
            'is_approved' => 1,
            'status'      => 'approved',
        ]);

        // Track activity
        ActivityLog::create([
            'user_id'     => $resource->user_id,
            'action'      => 'approved',
            'resource_id' => $resource->id,
            'details'     => 'Resource approved by admin: ' . $resource->title,
        ]);

        return response()->json(['success' => true, 'message' => 'Resource approved.']);
    }

    // Reject resource
    public function reject($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->update([
            'is_approved' => 0,
            'status'      => 'rejected',
        ]);

        // Track activity
        ActivityLog::create([
            'user_id'     => $resource->user_id,
            'action'      => 'rejected',
            'resource_id' => $resource->id,
            'details'     => 'Resource rejected by admin: ' . $resource->title,
        ]);

        return response()->json(['success' => true, 'message' => 'Resource rejected.']);
    }

    // Get total downloads
    public function stats()
    {
        $totalDownloads = Resource::sum('downloads');
        $pendingCount   = Resource::where('status', 'pending')->count();
        $approvedCount  = Resource::where('status', 'approved')->count();

        return response()->json([
            'success'        => true,
            'totalDownloads' => $totalDownloads,
            'pendingCount'   => $pendingCount,
            'approvedCount'  => $approvedCount,
        ]);
    }
}