<?php

namespace App\Http\Requests\Task;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class TaskStoreRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:191',
                Rule::unique('tasks')
                    ->whereNull('deleted_at')
                    ->where('user_id', $this->user()->id)
            ],
            'project_id' => [
                'nullable',
                'integer',
                Rule::exists('projects', 'id')->where('user_id', $this->user()->id)
            ],
            'client_id' => [
                'nullable',
                'integer',
                Rule::exists('clients', 'id')->where('user_id', $this->user()->id)
            ],
            'description' => ['nullable', 'string'],
        ];
    }
}
