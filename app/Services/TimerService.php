<?php

namespace App\Services;

use App\Models\Timer;
use App\Models\TimeInterval;

class TimerService
{
    public function toggle(Timer $timer): TimeInterval
    {
        $lastInterval = $timer->timeIntervals()->latest()->first();

        // Stop the timer if it's running
        if ($lastInterval && is_null($lastInterval->stop)) {
            $lastInterval->stop = now();
            $lastInterval->save();
            return $lastInterval;
        }

        // Start the timer if it's stopped
        return $timer->timeIntervals()->create([
            'start' => now()
        ]);
    }
}
