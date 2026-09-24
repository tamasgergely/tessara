<?php

namespace App\Http\Controllers\File;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\JsonResponse;

class FileController extends Controller
{

    public function show(File $file)
    {
        Gate::authorize('view', $file);

        abort_if(!Storage::disk('local')->exists($file->path), 404);

        return response()->file(
            Storage::disk('local')->path($file->path),
            ['Content-Disposition' => 'inline; filename="' . $file->filename . '"']
        );
    }

    public function update(Request $request, File $file): JsonResponse
    {
        Gate::authorize('update', $file);

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

        return response()->json(null, 204);
    }

    public function download(File $file)
    {
        Gate::authorize('view', $file);

        abort_if(!Storage::disk('local')->exists($file->path), 404);

        return Storage::disk('local')->download($file->path, $file->filename);
    }


    public function destroy(File $file): RedirectResponse
    {
        Gate::authorize('delete', $file);

        abort_if(!Storage::disk('local')->exists($file->path), 404);

        Storage::disk('local')->delete($file->path);

        $file->delete();

        return back()->with('success', 'File deleted successfully');
    }
}
