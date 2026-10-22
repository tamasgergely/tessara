<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property Carbon $start
 * @property Carbon|null $stop
 */
class TimeInterval extends Model
{
    /** @use HasFactory<\Database\Factories\TimeIntervalFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'start' => 'datetime',
        'stop'  => 'datetime',
    ];

    public function timer(): BelongsTo
    {
        return $this->belongsTo(Timer::class);
    }

    protected function scopeRunningAt($query, CarbonImmutable $now)
    {
        return $query->whereNull('stop')
            ->where('start', '>=', $now->subHours(config('timers.stuck_after_hours')));
    }

    protected function scopeStuckAt($query, CarbonImmutable $now)
    {
        return $query->whereNull('stop')
            ->where('start', '<', $now->subHours(config('timers.stuck_after_hours')));
    }
}
