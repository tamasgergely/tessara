<?php

use App\Models\User;

test('two users can each have a client with the same name', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $this->actingAs($user1)
        ->post(route('clients.store'), ['name' => 'Test client'])
        ->assertRedirect(route('clients.index'));

    $this->actingAs($user2)
        ->post(route('clients.store'), ['name' => 'Test client'])
        ->assertRedirect(route('clients.index'));

    expect($user1->clients()->count())->toBe(1);
    expect($user2->clients()->count())->toBe(1);

    expect($user1->clients()->first()->name)->toBe('Test client');
    expect($user2->clients()->first()->name)->toBe('Test client');
});

test('a user can not have two clients with the same name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('clients.store'), ['name' => 'Test client'])
        ->assertRedirect(route('clients.index'));

    $response = $this->actingAs($user)
        ->post(route('clients.store'), ['name' => 'Test client']);

    $response->assertSessionHasErrors('name');
    
    expect($user->clients()->count())->toBe(1);
});
