<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Department;
use App\Models\Course;
use App\Models\Reward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    // GET /api/resources
    public function index(Request $request)
    {
        $query = Resource::join('departments', 'resources.department_id', '=', 'departments.department_id')
            ->join('courses', 'resources.course_id', '=', 'courses.course_id')
            ->join('users', 'resources.user_id', '=', 'users.id')
            ->select(
                'resources.*',
                'departments.department_name',
                'courses.course_code',
                'courses.course_name',
                'users.name as uploader_name'
            );

        // Filter by department
        if ($request->department_id) {
            $query->where('resources.department_id', $request->department_id);
        }

        // Filter by course
        if ($request->course_id) {
            $query->where('resources.course_id', $request->course_id);
        }

        // Filter by resourceType
        if ($request->resourceType) {
            $query->where('resources.resourceType', $request->resourceType);
        }

        // Search by title
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('resources.title', 'like', '%'.$request->search.'%')
                ->orWhere('departments.department_name', 'like', '%'.$request->search.'%')
                ->orWhere('courses.course_code', 'like', '%'.$request->search.'%');
            });
        }

        // Aggregate: total downloads per department
        $resources = $query->latest('resources.created_at')->get();

        return response()->json($resources->map(function ($r) {
            return [
                'id'            => $r->id,
                'title'         => $r->title,
                'description'   => $r->description,
                'department_id' => $r->department_id,  
                'course_id'     => $r->course_id, 
                'courseName'    => $r->course_name,
                'department'    => $r->department_name,
                'courseCode'    => $r->course_code,
                'fileType'      => $r->file_type,
                'fileSize'      => $r->file_size,
                'uploadedBy'    => $r->uploader_name,
                'uploadedAt'    => $r->created_at->toDateString(),
                'downloads'     => $r->downloads,
        ];
        }));
    }

    // POST /api/resources/upload (AUTH REQUIRED)
    public function store(Request $request)
    {
        $request->validate([
            'title'         => 'required',
            'description'   => 'required',
            'department_id' => 'required|exists:departments,department_id',
            'course_id'     => 'required|exists:courses,course_id',
            'resourceType'  => 'required',
            'file'          => 'required|file|max:51200'
        ]);

        $file = $request->file('file');
        $path = $file->store('resources', 'public');

        $resource = Resource::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'department_id' => $request->department_id,
            'course_id'     => $request->course_id,
            'resourceType'  => $request->resourceType,
            'file_path'     => $path,
            'file_type'     => strtoupper($file->getClientOriginalExtension()),
            'file_size'     => round($file->getSize() / 1024 / 1024, 2) . ' MB',
            'user_id'       => $request->user()->id
        ]);

        // ADD REWARD POINTS FOR UPLOADING
        Reward::create([
            'user_id'            => $request->user()->id,
            'points_earned'      => 10,
            'reward_name'        => 'Resource Upload',
            'reward_description' => 'You earned 10 points for uploading "' . $request->title . '"',
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Uploaded successfully',
            'resource' => $resource
        ]);
    }

    // GET /api/download/{id} (AUTH REQUIRED)
    public function download($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->increment('downloads');

        $path = Storage::disk('public')->path($resource->file_path);

        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found on server'], 404);
        }

        $filename = $resource->title . '.' . strtolower($resource->file_type);
        return response()->download($path, $filename);
    }

    // GET /api/departments
    public function getDepartments()
    {
        return response()->json(Department::all());
    }

    // GET /api/courses/{department_id}
    public function getCourses($department_id)
    {
        return response()->json(
            Course::where('department_id', $department_id)->get()
        );
    }
}