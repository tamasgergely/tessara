<?php

namespace App\Models;

use App\Models\Client;
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

    public function timers(): HasMany
    {
        return $this->hasMany(Timer::class);
    }

    // #[Scope]
    protected function scopeForListing($query, $includeArchived = false, string $column = 'name', string $direction = 'asc')
    {
        return $query
            ->with(['project', 'client'])
            ->when(!$includeArchived, fn($q) => $q->whereNull('archived_at'))
            ->orderBy($column, $direction);
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
            })

            ->when($filters['state'] ?? 'active', function ($q, $state) {
                if ($state === 'active') {
                    return $q->whereNull('archived_at');
                } elseif ($state === 'archived') {
                    return $q->whereNotNull('archived_at');
                }
            });
    }
}
