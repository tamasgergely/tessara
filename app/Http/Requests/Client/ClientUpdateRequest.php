<?php

namespace App\Http\Requests\Client;

use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;

class ClientUpdateRequest extends FormRequest
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
                Rule::unique('clients')
                    ->whereNull('deleted_at')
                    ->where('user_id', $this->user()->id)
                    ->ignore($this->route('client'))
            ]
        ];
    }
}
