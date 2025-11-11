<?php

namespace App\Http\Resources;

use App\Services\TimeIntervalService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $service = app(TimeIntervalService::class);

        $elapsedTimeInHMS = $service->calculateElapsedTimeAsHMS($this->timeIntervals);
        $lastInterval = $this->timeIntervals->last();

        return [
            "id" => $this->id,
            "task_id" => $this->task_id,
            "task_name" => $this->task->name,
            "project_id" => $this->task->project?->id,
            "project_name" => $this->task->project?->name,
            'client_id' => $this->task->client?->id,
            'client_name' => $this->task->client?->name,
            "description" => $this->description,
            'elapsedTimeAsHMS' => $elapsedTimeInHMS,
            'start' => Carbon::parse($lastInterval->start)->format('Y-m-d\TH:i:s.v\Z'),
            'stop' => $lastInterval->stop ? Carbon::parse($lastInterval->stop)->format('Y-m-d\TH:i:s.v\Z') : null,
            'intervals' => $this->timeIntervals
        ];
    }
}
