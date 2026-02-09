<?php

namespace App\Http\Controllers\File;

use App\Models\File;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\JsonResponse;

class FileController extends Controller
{

    public function show(File $file)
    {
        abort_if($file->user_id !== auth()->id(), 403);
        abort_if(!Storage::disk('local')->exists($file->path), 404);

        return response()->file(
            Storage::disk('local')->path($file->path),
            ['Content-Disposition' => 'inline; filename="' . $file->filename . '"']
        );
    }

    public function update(Request $request, File $file): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(
                $validator->errors(),
                422
            );
        }

        $file->update($request->only(['title', 'description']));

        return response()->json([
            'file' => $file->fresh()
        ]);
    }

    public function download(File $file)
    {
        abort_if($file->user_id !== auth()->id(), 403);
        abort_if(!Storage::disk('local')->exists($file->path), 404);

        return Storage::disk('local')->download($file->path, $file->filename);
    }


    public function destroy(File $file): RedirectResponse
    {
        abort_if($file->user_id !== auth()->id(), 403);
        abort_if(!Storage::disk('local')->exists($file->path), 404);

        Storage::disk('local')->delete($file->path);

        $file->delete();

        return back()->with('success', 'File deleted successfully');
    }
}
