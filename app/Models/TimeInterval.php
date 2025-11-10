<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperTimeInterval
 */
class TimeInterval extends Model
{
    /** @use HasFactory<\Database\Factories\TimeIntervalFactory> */
    use HasFactory;

    protected $guarded = [];

    public function timer(): BelongsTo
    {
        return $this->belongsTo(Timer::class);
    }
}