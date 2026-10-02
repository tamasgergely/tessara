<?php

namespace App\Services;

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

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

    public function stopRunningIntervals(User $user): Collection
    {
        $now = CarbonImmutable::now();

        $intervals = $user->timeIntervals()
            ->where('start', '>=', $now->subHours(config('timers.stuck_after_hours')))
            ->whereNull('stop')
            ->get();

        return $intervals->each(function(TimeInterval $interval) use ($now){
            $interval->stop = $now;
            $interval->save();
        });
    }
}
