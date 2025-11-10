<?php

namespace Database\Factories;

use App\Models\Timer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeInterval>
 */
class TimeIntervalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = now();
        $endDate  = now()->addMinutes(20);

        return [
            'timer_id' => Timer::factory(),
            'start' => $startDate,
            'stop' => $endDate
        ];
    }
}
