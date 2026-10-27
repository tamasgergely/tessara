<?php

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\Timer;
use App\Models\User;

test('a task can not be created with a client other than its project\'s', function (Closure $request) {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $project = Project::factory()->for($user)->for($client)->create();
    $otherClient = Client::factory()->for($user)->create();

    [$method, $url, $data] = $request($user);

    $this->actingAs($user)
        ->{$method}($url, [
            ...$data,
            'project_id' => $project->id,
            'client_id' => $otherClient->id
        ])
        ->assertSessionHasErrors('project_id');
})->with([
    'start timer' => fn(User $user) => [
        'post',
        route('timers.store'),
        ['task_name' => 'Test task']
    ],
    'record timer' => fn(User $user) => [
        'post',
        route('timers.record'),
        ['task_name' => 'Test task', 'date' => '2026-10-01', 'from' => '09:00', 'to' => '10:00']
    ],
    'edit timer' => fn(User $user) => [
        'patch',
        route('timers.update', Timer::factory()->for($user)->create()),
        ['task_name' => 'Test task']
    ],
    'create task' => fn(User $user) => [
        'post',
        route('tasks.store'),
        ['name' => 'Test task']
    ],
    'edit task' => fn(User $user) => [
        'patch',
        route('tasks.update', Task::factory()->for($user)->create()),
        ['name' => 'Test task']
    ],
]);

test('a task can be created with its project\'s client', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $project = Project::factory()->for($user)->for($client)->create();

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => 'Test task',
            'project_id' => $project->id,
            'client_id' => $client->id
        ])
        ->assertSessionHasNoErrors();

    expect($project->tasks()->first()->name)->toBe('Test task');
});

test('a task in a project without a client can not have a client', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => 'Test task',
            'project_id' => $project->id,
            'client_id' => $client->id
        ])
        ->assertSessionHasErrors('project_id');
});


test('a task in a project without a client can be created without a client', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('timers.store'), [
            'task_name' => 'Test task',
            'project_id' => $project->id
        ])
        ->assertSessionHasNoErrors();

    expect($project->tasks()->first()->name)->toBe('Test task');
});
