<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a timer started after local midnight appears on its local day', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-09-20']);
    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 23:00:00',
        'stop' => '2026-09-27 23:30:00',
    ]);

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-28']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-27']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 0)
        );
});

test('a timer resumed after midnight stays on its first day', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-09-20']);

    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 20:00:00',
        'stop' => '2026-09-27 21:00:00',
    ]);

    // Budapest is UTC+2: 22:00–23:00 on the 27th, then 00:10–01:00 on the 28th.
    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 22:10:00',
        'stop' => '2026-09-27 23:00:00',
    ]);

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-27']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-28']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 0)
        );
});

test('a timer started exactly at local midnight belongs to the new day', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-09-20']);

    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 22:00:00',
        'stop' => '2026-09-27 23:00:00',
    ]);

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-27']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 0)
        );

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-28']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );
});

test('a timer without intervals appears on the day it was created', function () {
    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-09-20']);

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-09-20']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );
});

test('today is the user\'s local day, not the server\'s', function () {
    $this->travelTo('2026-09-27 23:30:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-09-20']);

    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 22:30:00',
        'stop' => '2026-09-27 23:00:00',
    ]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );
});

test('an invalid date falls back to today', function () {
    $this->travelTo('2026-09-27 23:30:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $timer = Timer::factory()->recycle($user)->create(['created_at' => '2026-09-20']);

    TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-27 22:30:00',
        'stop' => '2026-09-27 23:00:00',
    ]);

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => 'foo']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );
});
