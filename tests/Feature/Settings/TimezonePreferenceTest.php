<?php

use App\Models\User;

test('a valid timezone is saved to the preferences', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.preferences.update'), ['timezone' => 'Europe/Budapest'])
        ->assertSessionHasNoErrors();

    expect($user->fresh()->getPreference('timezone'))->toBe('Europe/Budapest');
});

test('a legacy timezone alias is accepted', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.preferences.update'), ['timezone' => 'Asia/Calcutta'])
        ->assertSessionHasNoErrors();

    expect($user->fresh()->getPreference('timezone'))->toBe('Asia/Calcutta');
});

test('an invalid timezone is rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.preferences.update'), ['timezone' => 'Invalid Timezone'])
        ->assertSessionHasErrors('timezone');

    expect($user->fresh()->getPreference('timezone'))->toBeNull();
});

test('saving the timezone keeps the other preferences', function () {
    $user = User::factory()->create();
    $user->setPreference('pagination.tasks', 20);

    $this->actingAs($user)
        ->patch(route('settings.preferences.update'), ['timezone' => 'Europe/Budapest'])
        ->assertSessionHasNoErrors();

    expect($user->fresh()->getPreference('timezone'))->toBe('Europe/Budapest');
    expect($user->fresh()->getPreference('pagination.tasks'))->toBe(20);
});
