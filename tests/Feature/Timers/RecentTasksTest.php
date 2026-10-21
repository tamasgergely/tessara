<?php

use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('recent tasks are ordered by their last use, not by when they were created', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $oldTask = Task::factory()->for($user)->create(['name' => 'old task, used yesterday', 'created_at' => '2026-09-01 08:00:00']);
    Timer::factory()->for($user)->for($oldTask)->startedAt('2026-10-14 08:00:00')->create();

    $freshTask = Task::factory()->for($user)->create(['name' => 'fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    Timer::factory()->for($user)->for($freshTask)->startedAt('2026-10-12 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 2)
                ->where('recentTasks.0.id', $oldTask->id)
                ->where('recentTasks.1.id', $freshTask->id)
        );
});

test('a task already used today is not offered', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $usedToday = Task::factory()->for($user)->create(['name' => 'used last week and today', 'created_at' => '2026-10-01 08:00:00']);
    Timer::factory()->for($user)->for($usedToday)->startedAt('2026-10-08 10:00:00')->create();
    Timer::factory()->for($user)->for($usedToday)->startedAt('2026-10-15 10:00:00')->create();

    $freshTask = Task::factory()->for($user)->create(['name' => 'fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    Timer::factory()->for($user)->for($freshTask)->startedAt('2026-10-12 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 1)
                ->where('recentTasks.0.id', $freshTask->id)
        );
});

test('a task that was never measured is not offered', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    Task::factory()->for($user)->create(['name' => 'never used', 'created_at' => '2026-10-14 08:00:00']);

    $freshTask = Task::factory()->for($user)->create(['name' => 'fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    Timer::factory()->for($user)->for($freshTask)->startedAt('2026-10-12 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 1)
                ->where('recentTasks.0.id', $freshTask->id)
        );
});

test('at most five recent tasks are offered', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $yesterdayTask = Task::factory()->for($user)->create(['name' => 'used yesterday', 'created_at' => '2026-09-01 08:00:00']);
    Timer::factory()->for($user)->for($yesterdayTask)->startedAt('2026-10-14 08:00:00')->create();

    $twoDayTask = Task::factory()->for($user)->create(['name' => 'used 2 days ago', 'created_at' => '2026-10-01 08:00:00']);
    Timer::factory()->for($user)->for($twoDayTask)->startedAt('2026-10-13 08:00:00')->create();

    $threeDayTask = Task::factory()->for($user)->create(['name' => 'used 3 days ago', 'created_at' => '2026-10-01 08:00:00']);
    Timer::factory()->for($user)->for($threeDayTask)->startedAt('2026-10-12 08:00:00')->create();

    $fourDayTask = Task::factory()->for($user)->create(['name' => 'used 4 days ago', 'created_at' => '2026-10-01 08:00:00']);
    Timer::factory()->for($user)->for($fourDayTask)->startedAt('2026-10-11 08:00:00')->create();

    $fiveDayTask = Task::factory()->for($user)->create(['name' => 'used 5 days ago', 'created_at' => '2026-10-01 08:00:00']);
    Timer::factory()->for($user)->for($fiveDayTask)->startedAt('2026-10-10 08:00:00')->create();

    $sixDayTask = Task::factory()->for($user)->create(['name' => 'used 6 days ago', 'created_at' => '2026-10-01 08:00:00']);
    Timer::factory()->for($user)->for($sixDayTask)->startedAt('2026-10-09 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 5)
                ->where('recentTasks', fn($recentTasks) => $recentTasks->doesntContain('id', $sixDayTask->id))
        );
});

test('recent tasks are only offered on today', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $freshTask = Task::factory()->for($user)->create(['name' => 'fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    Timer::factory()->for($user)->for($freshTask)->startedAt('2026-10-12 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index', ['date' => '2026-10-10']))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 0)
        );
});

test('each recent task carries its latest timer', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $freshTask = Task::factory()->for($user)->create(['name' => 'fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    $latestTimer = Timer::factory()->for($user)->for($freshTask)->startedAt('2026-10-12 08:00:00')->create();
    Timer::factory()->for($user)->for($freshTask)->startedAt('2026-10-11 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 1)
                ->where('recentTasks.0.timer_id', $latestTimer->id)
        );
});

test('another user\'s tasks are not offered', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);
    $otherUser = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $userTask = Task::factory()->for($user)->create(['name' => 'user fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    Timer::factory()->for($user)->for($userTask)->startedAt('2026-10-12 08:00:00')->create();

    $otherUserTask = Task::factory()->for($otherUser)->create(['name' => 'other user fresh task, used 3 days ago', 'created_at' => '2026-10-10 08:00:00']);
    Timer::factory()->for($otherUser)->for($otherUserTask)->startedAt('2026-10-12 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 1)
                ->where('recentTasks.0.id', $userTask->id)
        );
});

test('a past entry recorded today does not count as recent use', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $taskUsedYesterday = Task::factory()->for($user)->create(['created_at' => '2026-10-14 10:00:00']);
    Timer::factory()->for($user)->for($taskUsedYesterday)->startedAt('2026-10-14 10:00:00')->create();

    $manualTask = Task::factory()->for($user)->create(['created_at' => '2026-10-15 08:00:00']);
    $manualTaskTimer = Timer::factory()->for($user)->for($manualTask)->create(['created_at' => '2026-10-15 08:00:00']);
    TimeInterval::factory()->for($manualTaskTimer)->create(['start' => '2026-10-08 08:00:00']);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 2)
                ->where('recentTasks.0.id', $taskUsedYesterday->id)
                ->where('recentTasks.1.id', $manualTask->id)
        );
});

test('a recent task carries its latest timer by day, not by when it was recorded', function () {
    $this->travelTo('2026-10-15 12:00:00');

    $user = User::factory()->create(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $taskUsedYesterday = Task::factory()->for($user)->create(['created_at' => '2026-10-14 10:00:00']);
    $timerYesterday = Timer::factory()->for($user)->for($taskUsedYesterday)->startedAt('2026-10-14 10:00:00')->create();
    $timerManual = Timer::factory()->for($user)->for($taskUsedYesterday)->create(['created_at' => '2026-10-15 08:00:00']);
    TimeInterval::factory()->for($timerManual)->create(['start' => '2026-10-08 08:00:00']);

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('recentTasks', 1)
                ->where('recentTasks.0.timer_id', $timerYesterday->id)
        );
});
