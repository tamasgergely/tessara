<?php

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Carbon\Carbon;

test('a user can change the start time of an interval', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->running()->for($timer)->create();

    $start = Carbon::now()->subHour();

    $this->actingAs($user)
        ->patchJson(route('time-intervals.update', $interval), [
            'start' => $start->format('Y-m-d\TH:i:s.v\Z')
        ])
        ->assertOk();

    expect($interval->fresh()->start->toDateTimeString())->toBe($start->toDateTimeString());
});

test('the start time can not be in the future', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->running()->for($timer)->create();

    $start = Carbon::now()->addHour();
    $originalStart = $interval->start;

    $this->actingAs($user)
        ->patchJson(route('time-intervals.update', $interval), [
            'start' => $start->format('Y-m-d\TH:i:s.v\Z')
        ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'The start time cannot be in the future.');

    expect($interval->fresh()->start->toDateTimeString())->toBe($originalStart->toDateTimeString());
});

test('the end time can not be earlier than the start time', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->running()->for($timer)->create();

    $end = $interval->start->copy()->subHour();

    $this->actingAs($user)
        ->patchJson(route('time-intervals.update', $interval), [
            'stop' => $end->format('Y-m-d\TH:i:s.v\Z')
        ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'The end time cannot be earlier than or equal to the start time.');

    expect($interval->fresh()->stop)->toBeNull();
});

test('an interval can not overlap another interval of the same timer', function () {
    $now = Carbon::now();

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    TimeInterval::factory()->for($timer)->create([
        'start' => $now->copy()->subHours(4),
        'stop' => $now->copy()->subHours(3)
    ]);

    $interval = TimeInterval::factory()->for($timer)->create([
        'start' => $now->copy()->subHours(2),
        'stop' => $now->copy()->subHours(1)
    ]);

    $originalStart = $interval->start->copy();

    $this->actingAs($user)
        ->patchJson(route('time-intervals.update', $interval), [
            'start' => $now->copy()->subHours(5)->format('Y-m-d\TH:i:s.v\Z')
        ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'The time interval overlaps with another interval.');


    expect($interval->fresh()->start->toDateTimeString())->toBe($originalStart->toDateTimeString());
});

test('a user can not change an interval of another users timer', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->for($timer)->create();

    $intruder = User::factory()->create();

    $originalStart = $interval->start->copy();

    $this->actingAs($intruder)
        ->patchJson(route('time-intervals.update', $interval), [
            'start' => Carbon::now()->subHour()->format('Y-m-d\TH:i:s.v\Z')
        ])
        ->assertForbidden();

    expect($interval->fresh()->start->toDateTimeString())->toBe($originalStart->toDateTimeString());
});

test('a user can set the end time of a running interval', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();
    $interval = TimeInterval::factory()->running()->for($timer)->create();

    $stop = Carbon::now()->subHour();

    $this->actingAs($user)
        ->patchJson(route('time-intervals.update', $interval), [
            'stop' => $stop->format('Y-m-d\TH:i:s.v\Z')
        ])
        ->assertOk();

    expect($interval->fresh()->stop->toDateTimeString())->toBe($stop->toDateTimeString());
    expect($timer->timeIntervals()->whereNull('stop')->exists())->toBeFalse();
});
