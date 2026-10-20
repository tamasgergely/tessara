<?php

use App\Models\User;

test('a summer time in Budapest is two hours ahead of UTC', function () {
    $user = User::factory()->make(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $localMoment = $user->localMoment('2026-10-10', '01:00');

    expect($localMoment->toDateTimeString())->toBe('2026-10-09 23:00:00');
});

test('a winter time in Budapest is one hour ahead of UTC', function () {
    $user = User::factory()->make(['preferences' => ['timezone' => 'Europe/Budapest']]);

    $localMoment = $user->localMoment('2026-01-10', '00:30');

    expect($localMoment->toDateTimeString())->toBe('2026-01-09 23:30:00');
});

test('without a saved timezone the time is read as UTC', function () {
    $user = User::factory()->make();

    $localMoment = $user->localMoment('2026-01-10', '00:30');

    expect($localMoment->toDateTimeString())->toBe('2026-01-10 00:30:00');
});
