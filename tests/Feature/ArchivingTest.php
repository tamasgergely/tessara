<?php

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a user can archive and restore a client', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->patch(route('clients.toggle-archive', $client))
        ->assertRedirect();

    expect($client->fresh()->archived_at)->not->toBeNull();

    $this->actingAs($user)
        ->patch(route('clients.toggle-archive', $client))
        ->assertRedirect();

    expect($client->fresh()->archived_at)->toBeNull();
});

test('a user can archive and restore a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->patch(route('projects.toggle-archive', $project))
        ->assertRedirect();

    expect($project->fresh()->archived_at)->not->toBeNull();

    $this->actingAs($user)
        ->patch(route('projects.toggle-archive', $project))
        ->assertRedirect();

    expect($project->fresh()->archived_at)->toBeNull();
});

test('archiving a client hides it from the pickers', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['archived_at' => now()]);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('clients', fn($clients) => $clients->doesntContain('id', $client->id))
        );
});

test('archiving a client hides its projects and tasks from the pickers', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['archived_at' => now()]);
    $project = Project::factory()->for($client)->for($user)->create();
    $task = Task::factory()->for($user)->for($client)->for($project)->create();

    $visibleClient = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('clients', fn($clients) => $clients
                    ->doesntContain('id', $client->id) && $clients->contains('id', $visibleClient->id))
                ->where('projects', fn($projects) => $projects->doesntContain('id', $project->id))
                ->where('tasks', fn($tasks) => $tasks->doesntContain('id', $task->id))
        );
});

test('archiving a project hides its tasks from the pickers', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create(['archived_at' => now()]);
    $task = Task::factory()->for($user)->for($project)->create();

    $visibleProject = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('projects', fn($projects) => $projects
                    ->doesntContain('id', $project->id) && $projects->contains('id', $visibleProject->id))
                ->where('tasks', fn($tasks) => $tasks->doesntContain('id', $task->id))
        );
});

test('archived entities stay visible on the time entries page', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['archived_at' => now()]);
    $task = Task::factory()->for($user)->for($client)->create();
    $timer = Timer::factory()->recycle($user)->for($task)->create();
    TimeInterval::factory()->for($timer)->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('timers', fn($timers) => $timers->contains('id', $timer->id))
        );
});

test('a project of an archived client is marked as archived', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['archived_at' => now()]);
    $project = Project::factory()->for($user)->for($client)->create();

    $this->actingAs($user)
        ->get(route('projects.index', ['state' => 'all']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('projects')
                ->where('projects.data', fn($projects) => $projects->contains(
                    fn($row) => $row['id'] === $project->id && $row['archived'] === true
                ))
        );
});

test('the active filter hides projects of archived clients', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['archived_at' => now()]);
    $project = Project::factory()->for($user)->for($client)->create();

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('projects')
                ->where('projects.data', fn($projects) => $projects->doesntContain('id', $project->id))
        );
});
