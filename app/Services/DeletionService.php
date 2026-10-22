<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TimeInterval;
use App\Models\Timer;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DeletionService
{
    public function deleteTask(Task $task): void
    {
        DB::transaction(function () use ($task) {
            $this->deleteTasks(collect([$task->id]), CarbonImmutable::now());
        });
    }

    private function deleteTasks(Collection $taskIds, CarbonImmutable $now): void
    {
        $timerIds = Timer::whereIn('task_id', $taskIds)->pluck('id');

        TimeInterval::runningAt($now)->whereIn('timer_id', $timerIds)->update(['stop' => $now]);
        Timer::whereIn('id', $timerIds)->update(['deleted_at' => $now]);
        Task::whereIn('id', $taskIds)->update(['deleted_at' => $now]);
    }
}
