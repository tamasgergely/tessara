<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Project;
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

    public function deleteProject(Project $project): void
    {
        DB::transaction(function () use ($project) {
            $now = CarbonImmutable::now();
            $taskIds = $project->tasks()->pluck('id');

            $this->deleteTasks($taskIds, $now);
            Project::query()->where('id', $project->id)->update(['deleted_at' => $now]);
        });
    }

    public function deleteClient(Client $client): void
    {
        DB::transaction(function () use ($client) {
            $now = CarbonImmutable::now();

            $projectIds = $client->projects()->pluck('id');

            $taskIds = Task::query()->where('client_id', $client->id)
                ->orWhereIn('project_id', $projectIds)
                ->pluck('id');

            $this->deleteTasks($taskIds, $now);

            Project::query()->whereIn('id', $projectIds)->update(['deleted_at' => $now]);
            Client::query()->where('id', $client->id)->update(['deleted_at' => $now]);
        });
    }

    private function deleteTasks(Collection $taskIds, CarbonImmutable $now): void
    {
        $timerIds = Timer::query()->whereIn('task_id', $taskIds)->pluck('id');

        TimeInterval::runningAt($now)->whereIn('timer_id', $timerIds)->update(['stop' => $now]);
        Timer::query()->whereIn('id', $timerIds)->update(['deleted_at' => $now]);
        Task::query()->whereIn('id', $taskIds)->update(['deleted_at' => $now]);
    }
}
