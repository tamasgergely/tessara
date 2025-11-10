<?php

namespace App\Policies;

use App\Models\TimeInterval;
use App\Models\User;

class TimeIntervalPolicy
{
    private function belongsToUser(User $user, TimeInterval $timeInterval): bool
    {
        $timeInterval->loadMissing('timer');

        return $user->id === $timeInterval->timer->user_id;
    }

    public function update(User $user, TimeInterval $timeInterval): bool
    {
        return $this->belongsToUser($user, $timeInterval);
    }

    public function delete(User $user, TimeInterval $timeInterval): bool
    {
        return $this->belongsToUser($user, $timeInterval);
    }
}
