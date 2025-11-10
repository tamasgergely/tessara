<?php

namespace App\Http\Requests\Project;

use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;

class ProjectUpdateRequest extends FormRequest
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
                Rule::unique('projects')->where(fn(Builder $query) => $query->whereNull('deleted_at'))->ignore($this->route('project'))
            ],
            'client_id' => ['nullable', 'exists:clients,id'],
            'description' => ['nullable', 'string'],
            'archived' => ['boolean']
        ];
    }
}
