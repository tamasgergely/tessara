<?php

use App\Models\Client;
use App\Models\Task;
use App\Models\Timer;
use App\Models\User;

test('renaming a timer\'s task moves the timer and leaves the old task untouched', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->patch(route('timers.update', $timer), [
            'task_name' => 'New task'
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    $newTask = $user->tasks()->where('name', 'New task')->first();

    expect($timer->fresh()->task_id)->toBe($newTask->id);
    expect($task->fresh()->name)->toBe($task->name);
});

test('renaming a timer\'s task leaves the other timers on the old task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->create();
    $otherTimer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->patch(route('timers.update', $timer), [
            'task_name' => 'New task name'
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    expect($otherTimer->fresh()->task_id)->toBe($task->id);
});

test('editing a timer to an existing task\'s name moves it onto that task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $otherTask = Task::factory()->for($user)->create(['name' => 'Other task']);
    $timer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->patch(route('timers.update', $timer), [
            'task_name' => 'Other task'
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    expect($timer->fresh()->task_id)->toBe($otherTask->id);
});

test('changing a timer\'s client moves it to a task under that client', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();

    $task = Task::factory()->for($user)->for($client)->create(['name' => 'Test task']);
    $timer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->patch(route('timers.update', $timer), [
            'task_name' => 'Test task',
            'client_id' => $otherClient->id
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    $newTask = $user->tasks()->where('name', 'Test task')->where('client_id', $otherClient->id)->first();

    expect($timer->fresh()->task_id)->toBe($newTask->id);
    expect($task->fresh()->client_id)->toBe($client->id);
});

test('editing only the description keeps the timer on its task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create(['name' => 'Test task']);
    $timer = Timer::factory()->for($user)->for($task)->create(['description' => 'Test']);

    $this->actingAs($user)
        ->patch(route('timers.update', $timer), [
            'task_name' => 'Test task',
            'description' => 'Changed text'
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('timers.index'));

    expect($timer->fresh()->task_id)->toBe($task->id);
    expect($timer->fresh()->description)->toBe('Changed text');
    expect($user->tasks()->count())->toBe(1);
});
