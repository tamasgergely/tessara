<?php

namespace App\Policies;

use App\Models\Timer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TimerPolicy
{
    public function update(User $user, Timer $timer): bool
    {
        return $user->id === $timer->user_id;
    }

    public function delete(User $user, Timer $timer): bool
    {
        return $user->id === $timer->user_id;
    }
}
