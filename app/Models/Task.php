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
    protected function scopeForListing($query, $includeArchived = false)
    {
        return $query
            ->with(['project' => function ($query) {
                $query->whereNull('archived_at');
            }])
            ->with(['client' => function ($query) {
                $query->whereNull('archived_at');
            }])
            ->when(!$includeArchived, fn($q) => $q->whereNull('archived_at'))
            ->orderBy('name');
    }
}
