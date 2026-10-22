<?php

use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a deleted timer disappears from the list but is kept', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->startedAt('2026-10-10 08:00:00')->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 1)
                ->where('timers.0.id', $timer->id)
        );

    $this->delete(route('timers.destroy', $timer))
        ->assertRedirect(route('timers.index'));

    $this->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->has('timers', 0)
        );

    $this->assertSoftDeleted($timer);
});

test('a deleted timer keeps its intervals', function () {
    $this->travelTo('2026-10-10 12:00:00');

    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->startedAt('2026-10-10 08:00:00')->create();

    $this->actingAs($user)
        ->delete(route('timers.destroy', $timer))
        ->assertRedirect(route('timers.index'));

    expect($timer->timeIntervals()->count())->toBe(1);
});
