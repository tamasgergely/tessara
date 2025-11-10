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
            $this->updateStart($interval, $start);
        }

        if ($stop !== null) {
            $this->updateStop($interval, $stop);
        }

        // Validáljuk az interval-t
        $this->validateInterval($interval);

        // Ellenőrizzük az átfedéseket
        $this->checkForOverlaps($interval);

        $interval->save();

        return $interval->fresh();
    }

    private function updateStart(TimeInterval $interval, string $time): void
    {
        $date = Carbon::parse($interval->start)->format('Y-m-d');
        $interval->start = $date . ' ' . $time . ':00';
    }

    private function updateStop(TimeInterval $interval, string $time): void
    {
        $date = Carbon::parse($interval->stop ?? $interval->start)->format('Y-m-d');
        $interval->stop = $date . ' ' . $time . ':00';
    }

    private function validateInterval(TimeInterval $interval): void
    {
        if ($interval->start && $interval->stop) {
            $start = Carbon::parse($interval->start);
            $stop = Carbon::parse($interval->stop);

            if ($start->gte($stop)) {
                throw ValidationException::withMessages([
                    'time' => 'A befejező időpont nem lehet korábbi vagy egyenlő a kezdő időponttal.'
                ]);
            }
        }
    }

    private function checkForOverlaps(TimeInterval $interval): void
    {
        if (!$interval->timer_id || !$interval->start || !$interval->stop) {
            return;
        }

        $start = Carbon::parse($interval->start);
        $stop = $interval->stop ? Carbon::parse($interval->stop) : null;

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
            $this->throwOverlapException($overlapping);
        }
    }

    private function throwOverlapException(TimeInterval $overlapping): void
    {
        $start = Carbon::parse($overlapping->start)->format('H:i');
        $stop = $overlapping->stop
            ? Carbon::parse($overlapping->stop)->format('H:i')
            : 'folyamatban';

        throw ValidationException::withMessages([
            'time' => "Az időintervallum átfedésben van egy másik intervallummal: {$start} - {$stop}"
        ]);
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
