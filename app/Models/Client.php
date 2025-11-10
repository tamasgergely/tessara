<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperClient
 */
class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'archived_at', 'user_id'];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // #[Scope]
    protected function scopeForListing($query, $includeArchived = false)
    {
        return $query
            ->when(!$includeArchived, fn($q) => $q->whereNull('archived_at'))
            ->orderBy('name');
    }
}
