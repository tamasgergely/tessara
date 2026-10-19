<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Timer>
 */
class TimerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'task_id' => Task::factory(),
            'description' => fake()->sentence(12)
        ];
    }

    public function startedAt(string $createdAt): static
    {
        return $this->state(fn() => ['created_at' => $createdAt])
            ->afterCreating(function (Timer $timer) {
                TimeInterval::factory()->for($timer)->create(['start' => $timer->created_at]);
            });
    }

    public function runningSince(string $date): static
    {
        return $this->state(fn() => ['created_at' => $date])
            ->afterCreating(function (Timer $timer) use ($date) {
                TimeInterval::factory()->for($timer)->running()->create(['start' => $date]);
            });
    }
}
