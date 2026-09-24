<?php

use App\Models\Client;
use App\Models\File;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->intruder = User::factory()->create();
});

// Every guarded endpoint calls Gate::authorize as its first statement, so a 403
// also means nothing ran. Move that call and these tests stop being enough.

test('a user can not update another users timer', function () {
    $timer = Timer::factory()->recycle($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('timers.update', $timer), ['task_name' => 'Test task'])
        ->assertForbidden();
});

test('a user can not delete another users timer', function () {
    $timer = Timer::factory()->recycle($this->owner)->create();

    $this->actingAs($this->intruder)
        ->delete(route('timers.destroy', $timer))
        ->assertForbidden();
});

test('a user can not delete another users time interval', function () {
    $timer = Timer::factory()->recycle($this->owner)->create();
    $interval = TimeInterval::factory()->for($timer)->create();

    $this->actingAs($this->intruder)
        ->delete(route('time-intervals.destroy', $interval))
        ->assertForbidden();
});

test('a user can not update another users client', function () {
    $client = Client::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('clients.update', $client), ['name' => 'New client name'])
        ->assertForbidden();
});

test('a user can not delete another users client', function () {
    $client = Client::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->delete(route('clients.destroy', $client))
        ->assertForbidden();
});

test('a user can not update another users project', function () {
    $project = Project::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('projects.update', $project), ['name' => 'New project name'])
        ->assertForbidden();
});

test('a user can not delete another users project', function () {
    $project = Project::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->delete(route('projects.destroy', $project))
        ->assertForbidden();
});

test('a user can not update another users task', function () {
    $task = Task::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('tasks.update', $task), ['name' => 'New task name'])
        ->assertForbidden();
});

test('a user can not delete another users task', function () {
    $task = Task::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->delete(route('tasks.destroy', $task))
        ->assertForbidden();
});

test('a user can not view another users file', function () {
    $file = File::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->get(route('files.show', $file))
        ->assertForbidden();
});

test('a user can not download another users file', function () {
    $file = File::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->get(route('files.download', $file))
        ->assertForbidden();
});

test('a user can not update another users file', function () {
    $file = File::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('files.update', $file))
        ->assertForbidden();
});

test('a user can not delete another users file', function () {
    $file = File::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->delete(route('files.destroy', $file))
        ->assertForbidden();
});

test('a user can not archive another users client', function(){
    $client = Client::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('clients.toggle-archive', $client))
        ->assertForbidden();
});

test('a user can not archive another users project', function(){
    $project = Project::factory()->for($this->owner)->create();

    $this->actingAs($this->intruder)
        ->patch(route('projects.toggle-archive', $project))
        ->assertForbidden();
});
