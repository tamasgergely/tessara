<?php

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
