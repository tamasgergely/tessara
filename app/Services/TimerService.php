<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TimerService
{
    public function __construct(private TimeIntervalService $timeIntervalService) {}

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
            ->runningAt($now)
            ->get();

        return $intervals->each(function (TimeInterval $interval) use ($now) {
            $interval->stop = $now;
            $interval->save();
        });
    }

    public function startNew(Task $task, ?string $description = null, ?CarbonImmutable $now = null): Timer
    {
        return DB::transaction(function () use ($task, $description, $now) {
            $now ??= CarbonImmutable::now();
            $user = $task->user;

            $this->stopRunningIntervals($user, $now);

            $timer = $user->timers()->create(
                [
                    'description' => $description,
                    'task_id' => $task->id,
                ]
            );

            $timer->timeIntervals()->create(['start' => $now]);

            return $timer;
        });
    }

    public function createStopped(Task $task, CarbonImmutable $start, CarbonImmutable $stop, ?string $description = null): Timer
    {
        return DB::transaction(function () use ($task, $description, $start, $stop) {

            $interval = new TimeInterval(['start' => $start, 'stop' => $stop]);

            $this->timeIntervalService->validateInterval($interval);

            $user = $task->user;

            $timer = $user->timers()->create(
                [
                    'description' => $description,
                    'task_id' => $task->id,
                ]
            );

            $timer->timeIntervals()->save($interval);

            return $timer;
        });
    }
}
