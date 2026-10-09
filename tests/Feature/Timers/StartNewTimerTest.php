<?php

use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use App\Services\TimerService;
use Carbon\CarbonImmutable;

test('starting a new timer creates a running timer on the given task', function () {
    $now = CarbonImmutable::parse('2026-09-29 12:00:00');
    $task = Task::factory()->create();

    $timer = app(TimerService::class)->startNew($task, 'Test description', $now);

    $timers = $task->fresh()->timers();

    expect($timers->count())->toBe(1);
    expect($timers->first()->timeIntervals()->whereNull('stop')->count())->toBe(1);
    expect($timers->first()->user_id)->toBe($task->user_id);
    expect($timers->first()->timeIntervals()->first()->start->toDateTimeString())->toBe($now->toDateTimeString());
    expect($timer->id)->toBe($timers->first()->id);
});

test('starting a new timer stops the one already running', function () {
    $now = CarbonImmutable::parse('2026-09-29 12:00:00');

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $runningInterval = TimeInterval::factory()->for($timer)->running()->create(['start' => $now->subHours(2)]);

    $task = Task::factory()->for($user)->create();

    app(TimerService::class)->startNew($task, 'Test description', $now);

    expect($runningInterval->fresh()->stop->toDateTimeString())->toBe($now->toDateTimeString());
});

test('starting a new timer saves the description', function () {
    $now = CarbonImmutable::parse('2026-09-29 12:00:00');

    $task = Task::factory()->create();

    app(TimerService::class)->startNew($task, 'Test description', $now);

    expect($task->fresh()->timers()->first()->description)->toBe('Test description');
});

test('starting a new timer works without a description', function () {
    $now = CarbonImmutable::parse('2026-09-29 12:00:00');
    $task = Task::factory()->create();

    $timer = app(TimerService::class)->startNew($task, now: $now);

    $timers = $task->fresh()->timers();

    expect($timers->count())->toBe(1);
    expect($timers->first()->timeIntervals()->whereNull('stop')->count())->toBe(1);
    expect($timers->first()->description)->toBeNull();
    expect($timers->first()->user_id)->toBe($task->user_id);
    expect($timers->first()->timeIntervals()->first()->start->toDateTimeString())->toBe($now->toDateTimeString());
    expect($timer->id)->toBe($timers->first()->id);
});
