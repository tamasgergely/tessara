<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StuckTimerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $runningInterval = $this->timeIntervals->whereNull('stop')->first();

        return [
            'id' => $this->id,
            'task_name' => $this->task->name,
            'client_name' => $this->task->client?->name,
            'started_at' => $runningInterval->start,
            'date' => $this->localDay($request->user()->timezone())
        ];
    }
}
