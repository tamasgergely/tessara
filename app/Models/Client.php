<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @mixin IdeHelperClient
 */
class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'archived_at', 'user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function timers(): HasManyThrough
    {
        return $this->hasManyThrough(
            Timer::class,
            Task::class,
            'client_id',
            'task_id',
            'id',
            'id'
        );
    }

    // #[Scope]
    protected function scopeForListing($query, $includeArchived = false)
    {
        return $query
            ->when(!$includeArchived, fn($q) => $q->whereNull('archived_at'))
            ->orderBy('name');
    }
}
