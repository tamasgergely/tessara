<?php

use App\Models\Timer;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a timer without intervals does not break the time entries page', function () {
    $user = User::factory()->create();
    $timer = Timer::factory()->recycle($user)->create();

    $this->actingAs($user)
        ->get(route('timers.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('timers')
                ->where('timers', fn($timers) => $timers->contains('id', $timer->id))
        );
});
