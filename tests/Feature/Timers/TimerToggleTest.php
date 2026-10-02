<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Carbon\CarbonImmutable;

test('toggling a running timer closes its interval', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->running()->for($timer)->create();

    $this->actingAs($user)
        ->patch(route('timers-toggle.index', ['timer' => $timer]))
        ->assertOk();

    expect($interval->fresh()->stop)->not->toBeNull();
    expect($timer->timeIntervals()->count())->toBe(1);
});

test('toggling a stopped timer opens a new interval', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->create();

    $this->actingAs($user)
        ->patch(route('timers-toggle.index', ['timer' => $timer]))
        ->assertOk();

    expect($timer->timeIntervals()->count())->toBe(2);
    expect($timer->timeIntervals()->whereNull('stop')->count())->toBe(1);
});

test('a user can not toggle another users timer', function () {
    $owner = User::factory()->create();
    $timer = Timer::factory()->recycle($owner)->create();
    $interval = TimeInterval::factory()->running()->for($timer)->create();

    $intruder = User::factory()->create();

    $this->actingAs($intruder)
        ->patch(route('timers-toggle.index', ['timer' => $timer]))
        ->assertForbidden();

    expect($interval->fresh()->stop)->toBeNull();
});

test('toggling a running timer closes its open interval, not the latest one', function () {
    $this->travelTo('2026-10-01 21:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $runningInterval = TimeInterval::factory()->running()->for($timer)->create(['created_at' => '2026-10-01 16:00:00']);
    $latestInterval = TimeInterval::factory()->for($timer)->create([
        'start' => '2026-09-30 10:00:00',
        'stop' => '2026-09-30 11:00:00',
        'created_at' => '2026-10-01 20:00:00'
    ]);

    $this->actingAs($user)
        ->patch(route('timers-toggle.index', ['timer' => $timer]));

    expect($timer->fresh()->timeIntervals()->count())->toBe(2);
    expect($runningInterval->fresh()->stop->toDateTimeString())->toBe($now->toDateTimeString());
});
