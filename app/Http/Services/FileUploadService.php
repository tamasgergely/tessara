<?php

namespace App\Http\Services;

use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * @throws \RuntimeException
     */

    public function store(UploadedFile $file, string $directory, ?string $disk = null): array
    {
        $disk ??= config('filesystems.default');

        $storedFilename = Str::uuid() . '.' . $file->extension();

        $path = $file->storeAs($directory, $storedFilename, $disk);

        if (!$path) {
            throw new \RuntimeException('File upload failed.');
        }

        return [
            'disk' => $disk,
            'path' => $path,
            'stored_filename' => $storedFilename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ];
    }

    public function delete(string $path, ?string $disk = null): void
    {
        $disk ??= config('filesystems.default');

        Storage::disk($disk)->delete($path);
    }
}