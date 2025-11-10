<?php

namespace App\Http\Requests\TimeInterval;

use Illuminate\Foundation\Http\FormRequest;

class TimeIntervalUpdateRequest extends FormRequest
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
            'start' => ['nullable', 'date_format:H:i'],
            'stop' => ['nullable', 'date_format:H:i'],
        ];
    }
}
