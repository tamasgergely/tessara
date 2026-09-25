<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a timer running for more than 12 hours is reported as stuck', function () {
    $user = User::factory()->create();

    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->running()->create(['start' => now()->subHours(13)]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('stuckTimers', fn($stuckTimers) => $stuckTimers->contains('id', $timer->id))
        );
});

test('a timer running for less than 12 hours is not reported', function () {
    $user = User::factory()->create();

    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->running()->create(['start' => now()->subHours(11)]);

    $stuckTimer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($stuckTimer)->running()->create(['start' => now()->subHours(13)]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('stuckTimers', fn($stuckTimers) =>
                    $stuckTimers->contains('id', $stuckTimer->id)
                    && $stuckTimers->doesntContain('id', $timer->id)
                )
        );
});

test('a stopped interval is not reported however old it is', function () {
    $user = User::factory()->create();

    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->create([
        'start' => now()->subHours(20),
        'stop' => now()->subHours(19),
    ]);

    $stuckTimer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($stuckTimer)->running()->create(['start' => now()->subHours(13)]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('stuckTimers', fn($stuckTimers) =>
                    $stuckTimers->contains('id', $stuckTimer->id)
                    && $stuckTimers->doesntContain('id', $timer->id)
                )
        );
});

test('another user\'s stuck timer is not reported', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $stuckTimer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($stuckTimer)->running()->create(['start' => now()->subHours(13)]);

    $otherStuckTimer = Timer::factory()->recycle($otherUser)->create();
    TimeInterval::factory()->for($otherStuckTimer)->running()->create(['start' => now()->subHours(13)]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('stuckTimers', 1)
                ->where('stuckTimers.0.id', $stuckTimer->id)
        );
});

test('a stuck timer is reported regardless of the date filter', function () {
    $user = User::factory()->create();
    $stuckTimer = Timer::factory()->recycle($user)->create(['created_at' => now()->subDay()]);
    TimeInterval::factory()->for($stuckTimer)->running()->create(['start' => now()->subDay()]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 0)
                ->has('stuckTimers', 1)
                ->where('stuckTimers.0.id', $stuckTimer->id)
        );
});

test('several stuck timers are reported without lazy loading', function () {
    $user = User::factory()->create();

    $first = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($first)->running()->create(['start' => now()->subHours(13)]);

    $second = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($second)->running()->create(['start' => now()->subHours(14)]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(fn(Assert $page) => $page->has('stuckTimers', 2));
});

test('the date is the day the timer was created and the start is its oldest open interval', function () {
    $this->freezeSecond();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create(['created_at' => now()->subDays(3)]);

    TimeInterval::factory()->for($timer)->create([
        'start' => now()->subDays(3),
        'stop' => now()->subDays(3)->addHour(),
    ]);

    TimeInterval::factory()->for($timer)->running()->create(['start' => now()->subHours(20)]);
    $oldestOpen = TimeInterval::factory()->for($timer)->running()->create(['start' => now()->subDays(2)]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('stuckTimers.0.date', now()->subDays(3)->toDateString())
                ->where('stuckTimers.0.started_at', $oldestOpen->start->toJSON())
        );
});
