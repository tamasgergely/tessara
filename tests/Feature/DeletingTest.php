<?php

use App\Models\Client;
use App\Models\Project;
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

test('deleting a project deletes its tasks and their timers', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $task = Task::factory()->for($project)->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertRedirect();

    $this->assertSoftDeleted($project);
    $this->assertSoftDeleted($task);
    $this->assertSoftDeleted($timer);
});

test('deleting a project leaves other projects\' tasks untouched', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    Task::factory()->for($project)->for($user)->create();

    $otherProject = Project::factory()->for($user)->create();
    $otherProjectTask = Task::factory()->for($otherProject)->for($user)->create();

    $taskWithoutProject = Task::factory()->for($user)->create();

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertRedirect();

    $this->assertNotSoftDeleted($otherProjectTask);
    $this->assertNotSoftDeleted($taskWithoutProject);
});

test('deleting a project closes the running intervals of its timers', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $task = Task::factory()->for($project)->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->runningSince('2026-10-10 08:00:00')->create();

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertRedirect();

    expect($timer->timeIntervals()->first()->stop->toDateTimeString())->toBe('2026-10-10 12:00:00');
});

test('deleting a client deletes its projects, their tasks and timers', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $project = Project::factory()->for($user)->for($client)->create();
    $task = Task::factory()->for($project)->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->create();

    $this->actingAs($user)
        ->delete(route('clients.destroy', $client))
        ->assertRedirect();

    $this->assertSoftDeleted($client);
    $this->assertSoftDeleted($project);
    $this->assertSoftDeleted($task);
    $this->assertSoftDeleted($timer);
});

test('deleting a client deletes its tasks that have no project', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $task = Task::factory()->for($client)->for($user)->create();

    $this->actingAs($user)
        ->delete(route('clients.destroy', $client))
        ->assertRedirect();

    $this->assertSoftDeleted($client);
    $this->assertSoftDeleted($task);
});

test('deleting a client deletes a task of its project even if the task names another client', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $project = Project::factory()->for($user)->for($client)->create();
    $task = Task::factory()->for($project)->for($user)->for($otherClient)->create();

    $this->actingAs($user)
        ->delete(route('clients.destroy', $client))
        ->assertRedirect();

    $this->assertSoftDeleted($task);
});

test('deleting a client leaves other clients\' projects and tasks untouched', function () {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $project = Project::factory()->for($user)->for($client)->create();
    Task::factory()->for($project)->for($user)->create();

    $otherClient = Client::factory()->for($user)->create();
    $otherClientProject = Project::factory()->for($user)->for($otherClient)->create();
    $otherClientTask = Task::factory()->for($otherClientProject)->for($user)->for($otherClient)->create();

    $this->actingAs($user)
        ->delete(route('clients.destroy', $client))
        ->assertRedirect();

    $this->assertSoftDeleted($client);

    $this->assertNotSoftDeleted($otherClientTask);
    $this->assertNotSoftDeleted($otherClientProject);
});

test('deleting a client closes the running intervals of its timers', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $project = Project::factory()->for($user)->for($client)->create();
    $task = Task::factory()->for($project)->for($user)->create();
    $timer = Timer::factory()->for($user)->for($task)->runningSince('2026-10-10 08:00:00')->create();

    $this->actingAs($user)
        ->delete(route('clients.destroy', $client))
        ->assertRedirect();

    expect($timer->timeIntervals()->first()->stop->toDateTimeString())->toBe('2026-10-10 12:00:00');
});
