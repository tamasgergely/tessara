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
    protected function scopeForListing($query, string $column = 'created_at', string $direction = 'asc')
    {
        return $query
            ->with([
                'task.project',
                'task.client',
                'timeIntervals' => function ($query) {
                    $query->orderBy('id', 'asc');
                }
            ])->orderBy($column, $direction);
    }

    protected function scopeFilterListing($query, array $filters)
    {
        return $query
            ->when(!empty($filters['date']), function ($q) use ($filters) {
                $date = rescue(fn() => Carbon::parse($filters['date']), Carbon::today());
                return $q->whereDate('created_at', $date);
            })

            ->when(!empty($filters['date_range']), function ($q) use ($filters) {
                return rescue(
                    fn() => $q->whereBetween('created_at', [
                        Carbon::parse($filters['date_range']['start'])->startOfDay(),
                        Carbon::parse($filters['date_range']['end'])->endOfDay(),
                    ]),
                    $q
                );
            })

            ->when(!empty($filters['project_id']), function ($q) use ($filters) {
                return $q->whereHas('task', function ($q) use ($filters) {
                    $q->where('project_id', $filters['project_id']);
                });
            })

            ->when(!empty($filters['task_id']), function ($q) use ($filters) {
                return $q->where('task_id', $filters['task_id']);
            })

            ->when(!empty($filters['client_id']), function ($q) use ($filters) {
                return $q->whereHas('task', function ($q) use ($filters) {
                    $q->where('client_id', $filters['client_id']);
                });
            });
    }
}
