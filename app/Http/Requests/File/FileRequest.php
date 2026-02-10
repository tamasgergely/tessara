<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;

class FileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'files' => ['required', 'array', 'max:5'],

            'files.*.file' => [
                'required',
                'file',
                'max:10240',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],

            'files.*.name' => ['required', 'string'],
            'files.*.type' => ['required', 'string'],
            'files.*.size' => ['required', 'integer'],
            'files.*.title' => ['nullable', 'string', 'max:255'],
            'files.*.description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'files.required' => 'Please upload at least one file.',
            'files.array' => 'Files must be provided as a list.',
            'files.max' => 'You can upload up to :max files only.',

            'files.*.file.required' => 'Please select a file to upload.',
            'files.*.file.file' => 'The selected item must be a valid file.',
            'files.*.file.max' => 'Each file must not exceed 10 MB.',
            'files.*.file.mimetypes' => 'Allowed file types are: JPEG, PNG, GIF, WEBP, PDF, DOC, DOCX.',

            'files.*.name.required' => 'Please provide a name for the file.',
            'files.*.name.string' => 'File name must be text.',

            'files.*.type.required' => 'Please select the file type.',
            'files.*.type.string' => 'File type must be text.',

            'files.*.size.required' => 'File size is required.',
            'files.*.size.integer' => 'File size must be a number.',

            'files.*.title.string' => 'File title must be text.',
            'files.*.title.max' => 'File title cannot exceed 255 characters.',

            'files.*.description.string' => 'File description must be text.',
            'files.*.description.max' => 'File description cannot exceed 1000 characters.',
        ];
    }
}
