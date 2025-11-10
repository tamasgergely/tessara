<?php

namespace App\Http\Requests\Timer;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class TimerStoreRequest extends FormRequest
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
            'task_id' => [
                'nullable', 
                'integer', 
                Rule::exists('tasks', 'id')
                    ->where('user_id', request()->user()->id)
            ],
            'task_name' => ['required', 'string'],
            'project_id' => ['nullable', 'required_without:client_id', 'integer', 'exists:projects,id'],
            'client_id' => ['nullable', 'required_without:project_id', 'integer', 'exists:clients,id'],
            'description' => ['nullable', 'string'],
        ];
    }
}
