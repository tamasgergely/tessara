<?php

namespace App\Http\Requests\Timer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'project_id' => [
                'nullable',
                'integer',
                Rule::exists('projects', 'id')
                    ->where('user_id', $this->user()->id)
                    ->where('client_id', $this->client_id)
            ],
            'client_id' => [
                'nullable',
                'integer',
                Rule::exists('clients', 'id')->where('user_id', $this->user()->id)
            ],
            'task_name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
