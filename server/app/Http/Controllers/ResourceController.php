<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\ActivityLog;
use App\Models\Reward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    // GET /api/resources - only approved
    public function index(Request $request)
    {
        $query = Resource::with(['user', 'department', 'course'])
            ->where('is_approved', 1)
            ->where('status', 'approved')
            ->latest();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                  ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        $resources = $query->get();

        return response()->json($resources->map(function ($r) {
            return [
                'id'            => $r->id,
                'title'         => $r->title,
                'description'   => $r->description,
                'department'    => $r->department->department_name ?? '',
                'department_id' => $r->department_id,
                'courseName'    => $r->course->course_name ?? '',
                'courseCode'    => $r->course->course_code ?? '',
                'course_id'     => $r->course_id,
                'fileType'      => $r->file_type,
                'fileSize'      => $r->file_size,
                'uploadedBy'    => $r->user->name ?? '',
                'uploadedAt'    => $r->created_at->toDateString(),
                'downloads'     => $r->downloads,
            ];
        }));
    }

    // POST /api/resources/upload
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required',
            'description'  => 'required',
            'department_id'=> 'required',
            'course_id'    => 'required',
            'resourceType' => 'required',
            'file'         => 'required|file|max:51200'
        ]);

        $file = $request->file('file');
        $path = $file->store('resources', 'public');

        $resource = Resource::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'department_id'=> $request->department_id,
            'course_id'    => $request->course_id,
            'resourceType' => $request->resourceType,
            'file_path'    => $path,
            'file_type'    => strtoupper($file->getClientOriginalExtension()),
            'file_size'    => round($file->getSize() / 1024 / 1024, 2) . ' MB',
            'user_id'      => $request->user()->id,
            'is_approved'  => 0,
            'status'       => 'pending',
        ]);

        // Track activity
        ActivityLog::create([
            'user_id'     => $request->user()->id,
            'action'      => 'upload',
            'resource_id' => $resource->id,
            'details'     => 'Uploaded: ' . $resource->title,
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Uploaded successfully! Pending admin approval.',
            'resource' => $resource
        ]);
    }

    // GET /api/download/{id}
    public function download($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->increment('downloads');

        // Track activity
        ActivityLog::create([
            'user_id'     => auth()->id(),
            'action'      => 'download',
            'resource_id' => $resource->id,
            'details'     => 'Downloaded: ' . $resource->title,
        ]);

        // Award 5 points to the resource owner
        Reward::create([
            'user_id'            => $resource->user_id,
            'points_earned'      => 5,
            'reward_name'        => 'Download Reward',
            'reward_description' => 'Someone downloaded your resource: ' . $resource->title,
        ]);

        $path = Storage::disk('public')->path($resource->file_path);
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $filename = $resource->title . '.' . strtolower($resource->file_type);
        return response()->download($path, $filename);
    }

    // GET /api/departments
    public function departments()
    {
        return response()->json(\App\Models\Department::all());
    }

    // GET /api/courses/{department_id}
    public function courses($department_id)
    {
        return response()->json(
            \App\Models\Course::where('department_id', $department_id)->get()
        );
    }
}