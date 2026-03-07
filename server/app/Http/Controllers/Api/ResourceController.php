<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Resource;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'department' => 'required',
            'courseCode' => 'required',
            'resourceType' => 'required',
            'file' => 'required|file|max:51200'
        ]);

        $file = $request->file('file');

        $path = $file->store('resources');

        $resource = Resource::create([
            'title' => $request->title,
            'description' => $request->description,
            'department' => $request->department,
            'courseCode' => $request->courseCode,
            'resourceType' => $request->resourceType,
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'downloads' => 0
        ]);

        return response()->json($resource);
    }

    public function index()
    {
        $resources = Resource::latest()->get();

        return response()->json($resources);
    }

    public function download($id)
    {
        $resource = Resource::findOrFail($id);

        $resource->increment('downloads');

        return Storage::download($resource->file_path);
    }
}