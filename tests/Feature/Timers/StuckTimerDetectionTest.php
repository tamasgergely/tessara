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
                ->where(
                    'stuckTimers',
                    fn($stuckTimers) =>
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
                ->where(
                    'stuckTimers',
                    fn($stuckTimers) =>
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

test('the date is the local day of the first interval and the start is the oldest open interval', function () {
    $this->freezeSecond();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create(['created_at' => now()->subDays(5)]);

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

test('the date follows the user\'s timezone', function () {
    $this->travelTo('2026-09-29 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-08-15']);

    // 01:00 on the 28th in Budapest, still the 27th in UTC.
    TimeInterval::factory()->for($timer)->running()->create(['start' => '2026-09-27 23:00:00']);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('stuckTimers.0.date', '2026-09-28')
        );
});
