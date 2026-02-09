<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
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
            'name' => $this->filename,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'title' => $this->title,
            'description' => $this->description,
            'created_at' => $this->created_at,
            'user' => new UserResource(
                $this->whenLoaded('user')
            ),
        ];
    }
}
