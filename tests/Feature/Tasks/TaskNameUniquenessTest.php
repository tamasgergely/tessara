<?php

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

test('two projects can each have a task with the same name', function () {
    $user = User::factory()->create();
    $firstProject = Project::factory()->for($user)->create();
    $secondProject = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Test task',
            'project_id' => $firstProject->id
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('tasks.index'));

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Test task',
            'project_id' => $secondProject->id
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('tasks.index'));

    expect($firstProject->tasks()->first()->name)->toBe('Test task');
    expect($secondProject->tasks()->first()->name)->toBe('Test task');
});

test('two clients can each have a task with the same name', function () {
    $user = User::factory()->create();
    $firstClient = Client::factory()->for($user)->create();
    $secondClient = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Test task',
            'client_id' => $firstClient->id
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('tasks.index'));

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Test task',
            'client_id' => $secondClient->id
        ])->assertSessionHasNoErrors()
        ->assertRedirect(route('tasks.index'));

    expect($firstClient->tasks()->first()->name)->toBe('Test task');
    expect($secondClient->tasks()->first()->name)->toBe('Test task');
});

test('a project can not have two tasks with the same name', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    Task::factory()->for($user)->for($project)->create(['name' => 'Test task']);

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Test task',
            'project_id' => $project->id
        ])->assertSessionHasErrors('name');
});

test('a task with neither a client nor a project can not share its name with another one', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['name' => 'Test task']);

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'name' => 'Test task',
        ])->assertSessionHasErrors('name');
});

test('a task can be saved under its own name', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $task = Task::factory()->for($user)->for($project)->create(['name' => 'Test task']);

    $this->actingAs($user)
        ->patch(route('tasks.update', $task), [
            'name' => 'Test task',
            'project_id' => $project->id
        ])->assertSessionHasNoErrors();
});
