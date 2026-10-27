<?php

use App\Models\Client;
use App\Models\Task;
use App\Models\User;

test('starting a timer with an existing task\'s name reuses that task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create(['name' => 'Test task']);

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => 'Test task'
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    expect($user->tasks()->count())->toBe(1);
    expect($user->timers()->first()->task_id)->toBe($task->id);
});

test('starting a timer with an existing name under another client creates a new task', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $clientOther = Client::factory()->for($user)->create();

    Task::factory()->for($user)->for($client)->create(['name' => 'Test task']);

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => 'Test task',
            'client_id' => $clientOther->id
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    expect($user->tasks()->count())->toBe(2);
    expect($clientOther->tasks()->where('name', 'Test task')->exists())->toBeTrue();
});

test('recording a timer with an existing task\'s name reuses that task', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create();
    Task::factory()->for($user)->create(['name' => 'Test task']);

    $this->actingAs($user)
        ->post(route('timers.record'), [
            'task_name' => 'Test task',
            'date' => '2026-10-10',
            'from' => '08:00',
            'to' => '10:00'
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index', ['date' => '2026-10-10']));

    expect($user->tasks()->count())->toBe(1);
});
