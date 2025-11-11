<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    protected function start(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value) : null,
            set: fn($value) => $value ? Carbon::parse($value) : null
        );
    }

    protected function stop(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value) : null,
            set: fn($value) => $value ? Carbon::parse($value) : null
        );
    }
}
