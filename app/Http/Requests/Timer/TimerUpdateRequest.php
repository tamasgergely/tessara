<?php

namespace App\Http\Requests\Timer;

use Illuminate\Foundation\Http\FormRequest;

class TimerUpdateRequest extends FormRequest
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
            'timer_id' => ['required', 'exists:timers,id'],
            'task_name' => ['required', 'string'],
            'project_id' => ['nullable', 'required_without:client_id', 'integer', 'exists:projects,id'],
            'client_id' => ['nullable', 'required_without:project_id', 'integer', 'exists:clients,id'],
            'description' => ['nullable', 'string'],
        ];
    }
}
