<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    // GET /api/resources
    public function index()
    {
        $resources = Resource::with('user')->latest()->get();

        return response()->json($resources->map(function ($r) {
            return [
                'id' => $r->id,
                'title' => $r->title,
                'description' => $r->description,
                'department' => $r->department,
                'courseCode' => $r->courseCode,
                'fileType' => $r->file_type,
                'fileSize' => $r->file_size,
                'uploadedBy' => $r->user->name,
                'uploadedAt' => $r->created_at->toDateString(),
                'downloads' => $r->downloads,
            ];
        }));
    }

    // POST /api/upload (AUTH REQUIRED)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'department' => 'required',
            'courseCode' => 'required',
            'resourceType' => 'required',
            'file' => 'required|file|max:51200'
        ]);

        // STORE FILE
        $file = $request->file('file');
        $path = $file->store('resources', 'public');

        $resource = Resource::create([
            'title' => $request->title,
            'description' => $request->description,
            'department' => $request->department,
            'courseCode' => $request->courseCode,
            'resourceType' => $request->resourceType,

            'file_path' => $path,
            'file_type' => strtoupper($file->getClientOriginalExtension()),
            'file_size' => round($file->getSize() / 1024 / 1024, 2) . ' MB',

            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Uploaded successfully',
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
}