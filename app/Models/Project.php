<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @mixin IdeHelperProject
 */
class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function timers(): HasMany
    {
        return $this->hasMany(Timer::class);
    }

    // #[Scope]
    protected function scopeForListing($query, $includeArchived = false)
    {
        return $query
            ->with(['client', 'tasks'])
            ->when(!$includeArchived, fn($q) => $q->whereNull('archived_at'))
            ->orderBy('name');
    }
}
