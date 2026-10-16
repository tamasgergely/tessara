<?php

namespace App\Models;

use App\Models\Client;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperTask
 */
class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function files()
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function timers(): HasMany
    {
        return $this->hasMany(Timer::class);
    }

    // #[Scope]
    protected function scopeForPicking($query)
    {
        return $query
            ->with(['project', 'client'])
            ->whereDoesntHave('client',  fn($q) => $q->whereNotNull('archived_at'))
            ->whereDoesntHave('project', fn($q) => $q->whereNotNull('archived_at'))
            ->withMax('timers', 'created_at')
            ->orderByRaw('coalesce(timers_max_created_at, tasks.created_at) desc')
            ->orderBy('name');
    }

    protected function scopeForListing($query)
    {
        return $query
            ->with(['project', 'client'])
            ->withMax('timers', 'created_at')
            ->orderByRaw('coalesce(timers_max_created_at, tasks.created_at) desc')
            ->orderBy('name');
    }

    protected function scopeFilterListing($query, array $filters)
    {
        return $query
            ->when(!empty($filters['project_id']), function ($q) use ($filters) {
                return $q->where('project_id', $filters['project_id']);
            })

            ->when(!empty($filters['client_id']), function ($q) use ($filters) {
                return $q->where('client_id', $filters['client_id']);
            })

            ->when(!empty($filters['search']), function ($q) use ($filters) {
                return $q->where(function ($query) use ($filters) {
                    $query->where('name', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('description', 'like', '%' . $filters['search'] . '%');
                });
            });
    }

    protected function scopeRecentlyUsed($query, CarbonImmutable $todayStart, CarbonImmutable $todayEnd)
    {
        return $query
            ->with(['client', 'timers' => function ($query) {
                $query->orderByDesc('created_at')->limit(1);
            }])
            ->has('timers')
            ->whereDoesntHave('timers', function ($query) use ($todayStart, $todayEnd) {
                $query->filterListing(['between' => [$todayStart, $todayEnd]]);
            })
            ->orderByDesc(
                Timer::select('created_at')
                    ->whereColumn('task_id', 'tasks.id')
                    ->orderByDesc('created_at')
                    ->limit(1)
            );
    }
}
