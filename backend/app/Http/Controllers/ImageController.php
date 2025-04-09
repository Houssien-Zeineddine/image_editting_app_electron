<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image as InterventionImage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $images = Image::where('user_id', $request->user_id)->get();

        return response()->json($images);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|max:2048', // 2MB max
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $file = $request->file('image');
        $path = $file->store('images', 'public');

        $image = Image::create([
            'user_id' => $request->user_id,
            'name' => $file->getClientOriginalName(),
            'path' => $path,
        ]);

        return response()->json($image, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        
        $this->authorize('view', $image);
        return response()->json($image);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        $this->authorize('update', $image);

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|max:2048',
            'edits' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Delete old image
        Storage::disk('public')->delete($image->path);

        // Store new image
        $file = $request->file('image');
        $path = $file->store('images', 'public');

        $image->update([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'edits' => json_decode($request->edits, true),
        ]);

        return response()->json($image);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        $this->authorize('delete', $image);

        Storage::disk('public')->delete($image->path);
        $image->delete();

        return response()->json(null, 204);
    }
}
