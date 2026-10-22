<?php

namespace App\Services;

use App\Models\Task;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class DeletionService
{
    public function deleteTask(Task $task): void
    {
        DB::transaction(function () use ($task) {
            $now = CarbonImmutable::now();

            $task->timeIntervals()->runningAt($now)->update(['stop' => $now]);
            $task->timers()->update(['deleted_at' => $now]);
            $task->update(['deleted_at' => $now]);
        });
    }
}
