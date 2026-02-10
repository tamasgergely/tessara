<?php

namespace App\Http\Controllers\Tasks;

use App\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\File\FileRequest;
use App\Http\Services\FileUploadService;

class TaskFileController extends Controller
{
    public function store(FileRequest $request, Task $task, FileUploadService $uploader)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        $storedFiles = [];

        try {
            foreach ($validated['files'] as $fileArray) {
                $upload = $uploader->store(
                    $fileArray['file'],
                    "files/tasks/{$task->id}"
                );

                $storedFiles[] = $upload;

                $task->files()->create([
                    'user_id' => $request->user()->id,
                    'filename' => $upload['original_filename'],
                    'stored_filename' => $upload['stored_filename'],
                    'path' => $upload['path'],
                    'mime_type' => $upload['mime_type'],
                    'size' => $upload['size'],
                    'title' => $fileArray['title'] ?? null,
                    'description' => $fileArray['description'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('tasks.index');
        } catch (\Throwable $e) {
            DB::rollBack();

            foreach ($storedFiles as $file) {
                $uploader->delete($file['path'], $file['disk']);
            }

            Log::error('File upload failed', [
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'message' => 'The file upload failed. Please try again later.',
            ]);
        }
    }
}
