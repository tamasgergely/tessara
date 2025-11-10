<?php

namespace App\Http\Controllers\Timers;

use App\Models\Timer;
use App\Services\TimerService;
use App\Http\Controllers\Controller;
use Gate;

class TimerToggleController extends Controller
{
    public function __invoke(Timer $timer, TimerService $service)
    {
        Gate::authorize('update', $timer);

        $interval = $service->toggle($timer);
        
        return response()->json($interval);
    }
}
