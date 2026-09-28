<?php

use App\Models\User;

test('a summer day in Budapest starts at 22:00 UTC the previous day', function () {
    $user = User::factory()->make(['preferences' => ['timezone' => 'Europe/Budapest']]);

    [$start, $end] = $user->localDayBounds('2026-09-28');

    expect($start->toDateTimeString())->toBe('2026-09-27 22:00:00');
    expect($end->toDateTimeString())->toBe('2026-09-28 22:00:00');
});

test('a winter day in Budapest starts at 23:00 UTC the previous day', function () {
    $user = User::factory()->make(['preferences' => ['timezone' => 'Europe/Budapest']]);

    [$start, $end] = $user->localDayBounds('2026-01-15');

    expect($start->toDateTimeString())->toBe('2026-01-14 23:00:00');
    expect($end->toDateTimeString())->toBe('2026-01-15 23:00:00');
});

test('without a saved timezone the day is counted in UTC', function () {
    $user = User::factory()->make();

    [$start, $end] = $user->localDayBounds('2026-06-20');

    expect($start->toDateTimeString())->toBe('2026-06-20 00:00:00');
    expect($end->toDateTimeString())->toBe('2026-06-21 00:00:00');
});

test('a range includes the whole of its last day', function () {
    $user = User::factory()->make(['preferences' => ['timezone' => 'Europe/Budapest']]);

    [$start, $end] = $user->localDayBounds('2026-09-01', '2026-09-30');

    expect($start->toDateTimeString())->toBe('2026-08-31 22:00:00');
    expect($end->toDateTimeString())->toBe('2026-09-30 22:00:00');
});
