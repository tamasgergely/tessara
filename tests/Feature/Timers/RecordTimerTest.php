<?php

use App\Models\Task;
use App\Models\Timer;
use App\Models\User;

test('recording a timer ending before its start time ends it on the next day', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-05',
            'from' => '23:00',
            'to' => '04:00'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index', ['date' => '2026-10-05']));

    $timers = $user->timers();
    $interval = $timers->first()->timeIntervals()->first();

    expect($timers->count())->toBe(1);
    expect($interval->start->toDateTimeString())->toBe('2026-10-05 21:00:00');
    expect($interval->stop->toDateTimeString())->toBe('2026-10-06 02:00:00');
});

test('recording a timer ending after its start time ends it on the same day', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-05',
            'from' => '12:00',
            'to' => '14:00'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index', ['date' => '2026-10-05']));

    $timers = $user->timers();
    $interval = $timers->first()->timeIntervals()->first();

    expect($timers->count())->toBe(1);
    expect($interval->start->toDateTimeString())->toBe('2026-10-05 10:00:00');
    expect($interval->stop->toDateTimeString())->toBe('2026-10-05 12:00:00');
});

test('recording a timer leaves the running timer running', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');
    $runningTimer = Timer::factory()->for($user)->runningSince('2026-10-10 08:00:00')->create();

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-05',
            'from' => '10:00',
            'to' => '12:00'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index', ['date' => '2026-10-05']));

    expect($runningTimer->timeIntervals()->first()->stop)->toBeNull();
    expect($user->timers()->count())->toBe(2);
});

test('a timer can not be recorded on a future date', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-11',
            'from' => '14:00',
            'to' => '16:00'
        ])
        ->assertSessionHasErrors('date');
});

test('a timer can not be recorded with the same start and end time', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-08',
            'from' => '14:00',
            'to' => '14:00'
        ])
        ->assertSessionHasErrors('to');
});

test('a timer can not be recorded without a date, start or end time', function (string $field) {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $valid = [
        'task_name' => 'Test task',
        'date' => '2026-10-06',
        'from' => '12:00',
        'to' => '14:00',
    ];

    $this->actingAs($user)
        ->post(route('timers.record'), [...$valid, $field => ''])
        ->assertSessionHasErrors($field);
})->with(['date', 'from', 'to']);

test('a timer can not be recorded with a malformed time', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-05',
            'from' => '9:00',
            'to' => '14:00'
        ])
        ->assertSessionHasErrors('from');
});

test('a user can not record a timer on another user\'s task', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');
    $otherUser = User::factory()->create();
    $otherUserTask = Task::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_id' => $otherUserTask->id,
            'task_name' => $otherUserTask->name,
            'date' => '2026-10-05',
            'from' => '10:00',
            'to' => '12:00'
        ])
        ->assertSessionHasErrors('task_id');
});

test('a rejected recording does not leave a new task behind', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $user->setPreference('timezone', 'Europe/Budapest');

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-10',
            'from' => '11:00',
            'to' => '18:00'
        ])
        ->assertSessionHasErrors('time');

    expect($user->tasks()->count())->toBe(0);
});
