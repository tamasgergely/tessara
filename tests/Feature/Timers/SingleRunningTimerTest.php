<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use App\Services\TimerService;
use Carbon\CarbonImmutable;


test('a running interval is stopped at the current time', function () {
    $this->travelTo('2026-09-29 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->for($timer)->running()->create(['start' => $now->subHours(2)]);

    $result = app(TimerService::class)->stopRunningIntervals($user);

    expect(count($result))->toBe(1);
    expect($result[0]['stop']->toDateTimeString())->toBe($now->toDateTimeString());

    expect($interval->fresh()->stop->toDateTimeString())->toBe($now->toDateTimeString());
});

test('a stuck interval is left open', function () {
    $this->travelTo('2026-09-29 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();

    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->for($timer)->running()->create(['start' => $now->subHours(2)]);

    $stuckTimer = Timer::factory()->recycle($user)->create();
    $stuckInterval = TimeInterval::factory()->for($stuckTimer)->running()->create(['start' => $now->subHours(13)]);

    $result = app(TimerService::class)->stopRunningIntervals($user);

    expect(count($result))->toBe(1);
    expect($result[0]['stop']->toDateTimeString())->toBe($now->toDateTimeString());

    expect($interval->fresh()->stop->toDateTimeString())->toBe($now->toDateTimeString());
    expect($stuckInterval->fresh()->stop)->toBeNull();
});

test('another user\'s running interval is left alone', function () {
    $this->travelTo('2026-09-29 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->for($timer)->running()->create(['start' => $now->subHours(2)]);

    $otherUser = User::factory()->create();
    $otherUserTimer = Timer::factory()->recycle($otherUser)->create();
    $otherUserInterval = TimeInterval::factory()->for($otherUserTimer)->running()->create(['start' => $now->subHours(2)]);

    $result = app(TimerService::class)->stopRunningIntervals($user);

    expect(count($result))->toBe(1);
    expect($result[0]['stop']->toDateTimeString())->toBe($now->toDateTimeString());
    expect($otherUserInterval->fresh()->stop)->toBeNull();
});
