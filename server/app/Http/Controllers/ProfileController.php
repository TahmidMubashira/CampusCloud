<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Reward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        // ── Aggregate: total points ──────────────────────────────────────────
        $totalPoints = Reward::where('user_id', $userId)
            ->sum('points_earned');

        // ── Aggregate: total resources uploaded ──────────────────────────────
        $totalUploads = Resource::where('user_id', $userId)->count();

        // ── Aggregate: total downloads across all user's resources ───────────
        $totalDownloads = Resource::where('user_id', $userId)
            ->sum('downloads');

        // ── JOIN: recent 3 approved resources with dept + course ─────────────
        $recentUploads = Resource::join('departments', 'resources.department_id', '=', 'departments.department_id')
            ->join('courses', 'resources.course_id', '=', 'courses.course_id')
            ->where('resources.user_id', $userId)
            ->where('resources.status', 'approved')
            ->select(
                'resources.id',
                'resources.title',
                'resources.file_type',
                'resources.downloads',
                'resources.created_at',
                'departments.department_name',
                'courses.course_code'
            )
            ->latest('resources.created_at')
            ->limit(3)
            ->get();

        // ── JOIN: all approved resources (for view all) ───────────────────────
        $allApproved = Resource::join('departments', 'resources.department_id', '=', 'departments.department_id')
            ->join('courses', 'resources.course_id', '=', 'courses.course_id')
            ->where('resources.user_id', $userId)
            ->where('resources.status', 'approved')
            ->select(
                'resources.id',
                'resources.title',
                'resources.file_type',
                'resources.downloads',
                'resources.created_at',
                'departments.department_name',
                'courses.course_code'
            )
            ->latest('resources.created_at')
            ->get();

        // ── Pending uploads ───────────────────────────────────────────────────
        $pendingUploads = Resource::join('departments', 'resources.department_id', '=', 'departments.department_id')
            ->join('courses', 'resources.course_id', '=', 'courses.course_id')
            ->where('resources.user_id', $userId)
            ->where('resources.status', 'pending')
            ->select(
                'resources.id',
                'resources.title',
                'resources.file_type',
                'resources.created_at',
                'departments.department_name',
                'courses.course_code'
            )
            ->latest('resources.created_at')
            ->get();

        // ── Rejected uploads ──────────────────────────────────────────────────
        $rejectedUploads = Resource::join('departments', 'resources.department_id', '=', 'departments.department_id')
            ->join('courses', 'resources.course_id', '=', 'courses.course_id')
            ->where('resources.user_id', $userId)
            ->where('resources.status', 'rejected')
            ->select(
                'resources.id',
                'resources.title',
                'resources.file_type',
                'resources.created_at',
                'departments.department_name',
                'courses.course_code'
            )
            ->latest('resources.created_at')
            ->get();

        return response()->json([
            'success'         => true,
            'user'            => [
                'id'    => $request->user()->id,
                'name'  => $request->user()->name,
                'email' => $request->user()->email,
                'role'  => $request->user()->role,
            ],
            'totalPoints'     => (int) $totalPoints,
            'totalUploads'    => $totalUploads,
            'totalDownloads'  => (int) $totalDownloads,
            'recentUploads'   => $recentUploads->map(fn($r) => [
                'id'         => $r->id,
                'title'      => $r->title,
                'department' => $r->department_name,
                'courseCode' => $r->course_code,
                'fileType'   => $r->file_type,
                'downloads'  => $r->downloads,
                'timeAgo'    => $r->created_at->diffForHumans(),
            ]),
            'allApproved'     => $allApproved->map(fn($r) => [
                'id'         => $r->id,
                'title'      => $r->title,
                'department' => $r->department_name,
                'courseCode' => $r->course_code,
                'fileType'   => $r->file_type,
                'downloads'  => $r->downloads,
                'timeAgo'    => $r->created_at->diffForHumans(),
            ]),
            'pendingUploads'  => $pendingUploads->map(fn($r) => [
                'id'         => $r->id,
                'title'      => $r->title,
                'department' => $r->department_name,
                'courseCode' => $r->course_code,
                'fileType'   => $r->file_type,
                'timeAgo'    => $r->created_at->diffForHumans(),
            ]),
            'rejectedUploads' => $rejectedUploads->map(fn($r) => [
                'id'         => $r->id,
                'title'      => $r->title,
                'department' => $r->department_name,
                'courseCode' => $r->course_code,
                'fileType'   => $r->file_type,
                'timeAgo'    => $r->created_at->diffForHumans(),
            ]),
        ]);
    }
}