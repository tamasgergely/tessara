<?php

namespace App\Models;

use App\Models\TimeInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

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
    protected function scopeForListing($query, string $column = 'created_at', string $direction = 'desc')
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
            ->when(!empty($filters['between']), function ($q) use ($filters) {
                [$start, $end] = $filters['between'];

                $timerDay = DB::raw('COALESCE((SELECT MIN(start) FROM time_intervals WHERE time_intervals.timer_id = timers.id), timers.created_at)');

                return $q->where($timerDay, '>=', $start)->where($timerDay, '<', $end);
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

    protected function scopeStuck($query)
    {
        return $query
            ->whereHas('timeIntervals', function ($query) {
                $query->whereNull('stop')->where('start', '<', now()->subHours(12));
            });
    }

    public function localDay(string $timezone): string
    {
        $start = $this->timeIntervals->min('start') ?? $this->created_at;

        return $start->copy()->setTimezone($timezone)->toDateString();
    }
}
