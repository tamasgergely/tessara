<?php

namespace Database\Seeders;

use App\Models\Task;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Timer;
use App\Models\Client;
use App\Models\Project;
use App\Models\TimeInterval;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Tamás Gergely',
            'email' => 'tamas.gergely86@gmail.com',
        ]);

        // for ($i = 1; $i < 4; $i++) {
        //     Project::factory()
        //         ->count(1)
        //         ->for(Client::factory())
        //         ->has(Task::factory()->count(3))
        //         ->has(
        //             Timer::factory()
        //                 ->count(1)
        //                 ->state(['user_id' => 1])
        //                 ->has(TimeInterval::factory()->count(3))
        //         )
        //         ->create([
        //             'user_id' => 1
        //         ]);
        // }
    }
}
