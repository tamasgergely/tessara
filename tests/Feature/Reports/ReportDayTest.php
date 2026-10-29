<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a range includes the timers of its last day', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-08-15']);
    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-30 21:30:00',
        'stop' => '2026-09-30 21:45:00',
    ]);

    $this->actingAs($user)
        ->get(route('reports.index', ['date_range' => ['start' => '2026-09-01', 'end' => '2026-09-30']]))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('reports')
                ->has('groupedTimers', 1)
                ->where('groupedTimers.0.timers.0.id', $timer->id)
        );
});

test('a timer is grouped under its local day', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-08-15']);

    // 01:00 on the 28th in Budapest, still the 27th in UTC.
    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 23:00:00',
        'stop' => '2026-09-27 23:30:00',
    ]);

    $this->actingAs($user)
        ->get(route('reports.index', ['date_range' => ['start' => '2026-09-01', 'end' => '2026-09-30']]))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('reports')
                ->has('groupedTimers', 1)
                ->where('groupedTimers.0.date', '2026-09-28')
                ->where('groupedTimers.0.timers.0.id', $timer->id)
        );
});


test('a timer resumed after midnight is grouped under its first day', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-08-15']);

    // Created out of order: the listing loads intervals by id, not by start.
    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 22:00:00',
        'stop' => '2026-09-27 22:30:00',
    ]);

    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 21:00:00',
        'stop' => '2026-09-27 21:30:00',
    ]);

    $this->actingAs($user)
        ->get(route('reports.index', ['date_range' => ['start' => '2026-09-01', 'end' => '2026-09-30']]))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('reports')
                ->has('groupedTimers', 1)
                ->where('groupedTimers.0.date', '2026-09-27')
                ->where('groupedTimers.0.timers.0.id', $timer->id)
        );
});

test('without filters the report is empty', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-08-15']);

    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 21:00:00',
        'stop' => '2026-09-27 21:30:00',
    ]);

    $this->actingAs($user)
        ->get(route('reports.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('reports')
                ->has('groupedTimers', 0)
        );
});

test('report days come in chronological order even when a timer was recorded later', function () {
    $this->travelTo('2026-10-16 16:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    Timer::factory()->recycle($user)->startedAt('2026-10-15 12:00:00')->create();

    $manualTimer = Timer::factory()->for($user)->create(['created_at' => '2026-10-16 10:00:00']);
    TimeInterval::factory()->for($manualTimer)->create(['start' => '2026-10-14 08:00:00']);

    $this->actingAs($user)
        ->get(route('reports.index', ['date_range' => ['start' => '2026-10-14', 'end' => '2026-10-15']]))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('reports')
                ->has('groupedTimers', 2)
                ->where('groupedTimers.0.date', '2026-10-14')
                ->where('groupedTimers.1.date', '2026-10-15')
        );
});
