<?php

use App\Models\Task;
use App\Models\User;

test('a user with no clients or projects can start a timer', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => 'Test task'
        ])->assertRedirect(route('timers.index'))
        ->assertSessionHasNoErrors();

    $user->timers()->sole();
    $task = $user->tasks()->sole();

    expect($task->client_id)->toBeNull();
    expect($task->project_id)->toBeNull();
});


test('a timer can be started on an existing task', function () {
    $user = User::factory()->create();
    $originalTask = Task::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => $originalTask->name,
            'task_id' => $originalTask->id
        ])->assertRedirect(route('timers.index'))
        ->assertSessionHasNoErrors();

    $timer = $user->timers()->sole();
    $task = $user->tasks()->sole();

    expect($timer->task_id)->toBe($originalTask->id);
    expect($task->id)->toBe($originalTask->id);
});


test('a timer can not be started on another user\'s task', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherUserTask = Task::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => $otherUserTask->name,
            'task_id' => $otherUserTask->id
        ])->assertSessionHasErrors('task_id');

    expect($user->timers()->count())->toBe(0);
    expect($otherUser->timers()->count())->toBe(0);

});
