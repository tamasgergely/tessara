<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->word() . '.pdf';
        $stored = Str::uuid() . '.pdf';

        return [
            'fileable_type' => Project::class,
            'fileable_id' => Project::factory(),
            'user_id' => User::factory(),
            'filename' => $filename,
            'stored_filename' => $stored,
            'path' => 'files/projects/' . $stored,
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(1000, 500000),
        ];
    }
}
