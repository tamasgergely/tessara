<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
}
