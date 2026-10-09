<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Carbon\CarbonImmutable;

test('continuing a timer starts a new timer on the same task', function () {
    $this->travelTo('2026-10-09 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->create(['start' => $now->subDays(3)]);

    $this->actingAs($user)
        ->post(route('timers.continue', $timer))
        ->assertRedirect(route('timers.index'))
        ->assertSessionHasNoErrors();

    $newTimer = $user->timers()->latest('id')->first();

    expect($user->timers()->count())->toBe(2);
    expect($newTimer->task_id)->toBe($timer->task_id);
    expect($newTimer->timeIntervals()->count())->toBe(1);
    expect($newTimer->timeIntervals()->first()->start->toDateTimeString())->toBe($now->toDateTimeString());
    expect($newTimer->timeIntervals()->whereNull('stop')->count())->toBe(1);
});

test('continuing a timer copies its description', function () {
    $this->travelTo('2026-10-09 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create(['description' => 'Fix the checkout bug']);
    TimeInterval::factory()->for($timer)->create(['start' => $now->subDays(3)]);

    $this->actingAs($user)
        ->post(route('timers.continue', $timer))
        ->assertRedirect(route('timers.index'))
        ->assertSessionHasNoErrors();

    expect($user->timers()->count())->toBe(2);
    expect($user->timers()->latest('id')->first()->description)->toBe('Fix the checkout bug');
});

test('continuing a timer leaves the original untouched', function () {
    $this->travelTo('2026-10-09 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->create(['start' => $now->subDays(3)]);

    $oldTimer = $user->timers()->oldest('id')->first();
    $oldTimerArray = $oldTimer->toArray();
    $oldIntervalsArray = $oldTimer->timeIntervals->toArray();

    $this->actingAs($user)
        ->post(route('timers.continue', $timer))
        ->assertRedirect(route('timers.index'))
        ->assertSessionHasNoErrors();

    expect($timer->fresh()->toArray())->toBe($oldTimerArray);
    expect($timer->fresh()->timeIntervals->toArray())->toBe($oldIntervalsArray);
});

test('a user can not continue another user\'s timer', function () {
    $this->travelTo('2026-10-09 12:00:00');

    $now = CarbonImmutable::now();

    $user = User::factory()->create();

    $otherUser = User::factory()->create();
    $otherUserTimer = Timer::factory()->recycle($otherUser)->create();
    TimeInterval::factory()->for($otherUserTimer)->create(['start' => $now->subDays(3)]);

    $this->actingAs($user)
        ->post(route('timers.continue', $otherUserTimer))
        ->assertForbidden();

    expect($otherUser->timers()->count())->toBe(1);
    expect($user->timers()->count())->toBe(0);
});

test('a timer whose task was deleted can not be continued', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $timer->task()->delete();

    $this->actingAs($user)
        ->post(route('timers.continue', $timer))
        ->assertNotFound();

    expect($user->timers()->count())->toBe(1);
});
