<?php

use App\Models\Task;
use App\Models\Timer;
use App\Models\User;
use App\Services\TimerService;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

test('creating a stopped timer records a closed interval on the given task', function () {
    $this->travelTo('2026-10-10 10:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $start = CarbonImmutable::parse('2026-10-05 10:00:00');
    $stop = CarbonImmutable::parse('2026-10-05 13:00:00');

    $responseTimer = app(TimerService::class)->createStopped($task, $start, $stop, 'Test description');
    $dbTimer = $task->timers()->first();

    expect($dbTimer->user_id)->toBe($user->id);
    expect($task->timers()->count())->toBe(1);
    expect($responseTimer->is($dbTimer))->toBeTrue();
    expect($dbTimer->timeIntervals()->count())->toBe(1);
    expect($dbTimer->timeIntervals()->first()->start->toDateTimeString())->toBe($start->toDateTimeString());
    expect($dbTimer->timeIntervals()->first()->stop->toDateTimeString())->toBe($stop->toDateTimeString());
    expect($dbTimer->description)->toBe('Test description');
});

test('creating a stopped timer leaves the running timer running', function () {
    $this->travelTo('2026-10-10 20:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $runningTimer = Timer::factory()->for($user)->for($task)->runningSince('2026-10-10 12:00:00')->create();

    $start = CarbonImmutable::parse('2026-10-05 10:00:00');
    $stop = CarbonImmutable::parse('2026-10-05 13:00:00');

    app(TimerService::class)->createStopped($task, $start, $stop, 'Test description');

    expect($runningTimer->timeIntervals()->first()->stop)->toBeNull();
    expect($task->timers()->count())->toBe(2);
});

test('creating a stopped timer with an invalid interval creates nothing', function () {
    $this->travelTo('2026-10-10 20:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $start = CarbonImmutable::parse('2026-10-05 10:00:00');
    $stop = CarbonImmutable::parse('2026-10-04 13:00:00');

    $service = app(TimerService::class);

    expect(fn() => $service->createStopped($task, $start, $stop))
        ->toThrow(ValidationException::class);

    expect($task->timers()->count())->toBe(0);
});

test('creating a stopped timer can not span 24 hours or more', function () {
    $this->travelTo('2026-10-10 20:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $start = CarbonImmutable::parse('2026-10-05 10:00:00');
    $stop = CarbonImmutable::parse('2026-10-06 10:00:00');

    $service = app(TimerService::class);

    expect(fn() => $service->createStopped($task, $start, $stop))
        ->toThrow(ValidationException::class);

    expect($task->timers()->count())->toBe(0);
});
