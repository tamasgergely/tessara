<?php

namespace App\Services;

use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TimerService
{
    public function toggle(Timer $timer): TimeInterval
    {
        $now = CarbonImmutable::now();

        $openInterval = $timer->timeIntervals()->whereNull('stop')->first();

        // Stop the timer if it's running
        if ($openInterval) {
            $openInterval->stop = $now;
            $openInterval->save();
            return $openInterval;
        }

        return DB::transaction(function () use ($timer, $now) {
            // Start the timer if it's stopped
            $this->stopRunningIntervals($timer->user, $now);

            return $timer->timeIntervals()->create([
                'start' => $now
            ]);
        });
    }

    public function stopRunningIntervals(User $user, ?CarbonImmutable $now = null): Collection
    {
        $now ??= CarbonImmutable::now();

        $intervals = $user->timeIntervals()
            ->where('start', '>=', $now->subHours(config('timers.stuck_after_hours')))
            ->whereNull('stop')
            ->get();

        return $intervals->each(function (TimeInterval $interval) use ($now) {
            $interval->stop = $now;
            $interval->save();
        });
    }
}
