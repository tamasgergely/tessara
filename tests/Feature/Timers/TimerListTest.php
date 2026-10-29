<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a timer without intervals does not break the time entries page', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('timers', fn($timers) => $timers->contains('id', $timer->id))
        );
});

test('timers of a day are listed latest started first', function () {
    $this->travelTo('2026-10-15 14:00:00');

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->startedAt('2026-10-15 10:00:00')->create();

    $manualTimer = Timer::factory()->for($user)->create(['created_at' => '2026-10-15 12:00:00']);
    TimeInterval::factory()->for($manualTimer)->create(['start' => '2026-10-15 07:00:00']);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 2)
                ->where('timers.0.id', $timer->id)
                ->where('timers.1.id', $manualTimer->id)
        );
});
