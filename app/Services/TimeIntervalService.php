<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\TimeInterval;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class TimeIntervalService
{
    public function updateIntervalTime(TimeInterval $interval, ?string $start, ?string $stop): TimeInterval
    {
        if ($start !== null) {
            $interval->start = $start;
        }

        if ($stop !== null) {
            $interval->stop = $stop;
        }

        $this->validateInterval($interval);

        $this->checkForOverlaps($interval);

        $interval->save();

        return $interval->fresh();
    }

    private function validateInterval(TimeInterval $interval): void
    {
        if ($interval->start && $interval->stop) {
            if ($interval->start->gte($interval->stop)) {
                throw ValidationException::withMessages([
                    'time' => 'The end time cannot be earlier than or equal to the start time.'
                ]);
            }
        }
    }

    private function checkForOverlaps(TimeInterval $interval): void
    {
        if (!$interval->timer_id || !$interval->start || !$interval->stop) {
            return;
        }

        $start = $interval->start;
        $stop = $interval->stop ? $interval->stop : null;

        $overlapping = TimeInterval::where('timer_id', $interval->timer_id)
            ->where('id', '!=', $interval->id)
            ->where(function ($q) use ($start, $stop) {
                $q->whereBetween('start', [$start, $stop])
                    ->orWhereBetween('stop', [$start, $stop])
                    ->orWhere(function ($subQ) use ($start, $stop) {
                        $subQ->where('start', '<=', $start)
                            ->where('stop', '>=', $stop);
                    })
                    ->orWhere(function ($subQ) use ($start) {
                        $subQ->where('start', '<=', $start)
                            ->whereNull('stop');
                    });
            })->first();

        if ($overlapping) {
            throw ValidationException::withMessages([
                'time' => "The time interval overlaps with another interval."
            ]);
        }
    }

    /**
     * Calculate the total time intervals in seconds from an array of time intervals
     * and convert the result to hours, minutes, and seconds.
     */
    public function calculateElapsedTimeAsHMS(Collection $intervals): array
    {
        $seconds = $intervals->sum(fn($interval) => $this->getTimeIntervalInSeconds($interval));

        return [
            'hours' => intdiv($seconds, 3600),
            'minutes' => intdiv($seconds % 3600, 60),
            'seconds' => $seconds % 60,
        ];
    }

    /**
     * Calculate and return the time interval in seconds between 
     * the start time and end time (if available) for the current instance.
     */
    private function getTimeIntervalInSeconds(TimeInterval $interval): Int
    {
        $start = Carbon::parse($interval->start);

        $stop = $interval->stop ? Carbon::parse($interval->stop) : now();

        return $start->diffInSeconds($stop);
    }
}
