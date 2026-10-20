<?php

namespace App\Http\Requests\Timer;

use App\Http\Requests\Timer\TimerStoreRequest;
use Illuminate\Validation\Rule;

class TimerRecordRequest extends TimerStoreRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $today = now($this->user()->timezone());

        return [
            ...parent::rules(),
            'date' => [
                'required',
                Rule::date()->format('Y-m-d')->beforeOrEqual($today)
            ],
            'from' => [
                'required',
                Rule::date()->format('H:i')
            ],
            'to' => [
                'required',
                'different:from',
                Rule::date()->format('H:i'),
            ]
        ];
    }
}
