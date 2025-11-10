<?php

namespace App\Models;

use App\Models\TimeInterval;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperTimer
 */
class Timer extends Model
{
    /** @use HasFactory<\Database\Factories\TimerFactory> */
    use HasFactory;

    protected $guarded = [];

    public function timeIntervals(): HasMany
    {
        return $this->hasMany(TimeInterval::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function project()
    {
        return $this->hasOneThrough(
            Project::class,
            Task::class,
            'id',          // Task.id = Timer.task_id
            'id',          // Project.id = Task.project_id
            'task_id',     // Timer.task_id
            'project_id'   // Task.project_id
        );
    }

    public function client()
    {
        return $this->hasOneThrough(
            Client::class,
            Task::class,
            'id',          // Task.id
            'id',          // Client.id
            'task_id',     // Timer.task_id
            'client_id'    // Task.client_id
        );
    }

    // #[Scope]
    protected function scopeForListing($query, ?string $date = null)
    {
        $date = rescue(fn() => Carbon::parse($date), Carbon::today());

        return $query
            ->with([
                'task.project',
                'task.client',
                'timeIntervals' => function ($query) {
                    $query->orderBy('id', 'asc');
                }
            ])->whereDate('created_at', $date);
    }
}
