<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'archived' => (bool) $this->archived_at,
            'project' => $this->project ?  [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ] : null,
            'client' => $this->client ? [
                'id' => $this->client->id,
                'name' => $this->client->name
            ] : null,
        ];
    }
}
