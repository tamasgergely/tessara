<?php

namespace Database\Factories;

use App\Models\Timer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

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
        return [
            'timer_id' => Timer::factory(),
            'start' => now()->subHours(2),
            'stop' => fn (array $attributes) => Carbon::parse($attributes['start'])->addHour(),
        ];
    }
    

    public function running(): static
    {
        return $this->state(fn() => ['stop' => null]);
    }
}
