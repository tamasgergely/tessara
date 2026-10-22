<?php

use App\Models\Task;
use App\Models\Timer;
use App\Models\User;

test('deleting a task deletes its timers with the same timestamp', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect();

    expect($task->fresh()->deleted_at->toDateTimeString())->toBe('2026-10-10 12:00:00');
    expect($timer->fresh()->deleted_at->toDateTimeString())->toBe('2026-10-10 12:00:00');
});

test('deleting a task leaves other tasks\' timers untouched', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->create();

    $otherTask = Task::factory()->for($user)->create();
    $otherTaskTimer = Timer::factory()->for($user)->for($otherTask)->create();

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect();

    $this->assertNotSoftDeleted($otherTaskTimer);
});

test('deleting a task closes its running interval at the moment of deletion', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->runningSince('2026-10-10 08:00:00')->create();

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect();

    expect($timer->timeIntervals()->first()->stop->toDateTimeString())->toBe('2026-10-10 12:00:00');
});

test('deleting a task leaves its stuck interval open', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->runningSince('2026-10-05 08:00:00')->create();

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect();

    expect($timer->timeIntervals()->first()->stop)->toBeNull();
});
