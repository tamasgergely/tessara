<?php

namespace App\Http\Controllers\Timers;

use App\Http\Controllers\Controller;
use App\Models\Timer;
use App\Services\TimerService;
use Illuminate\Support\Facades\Gate;

class TimerContinueController extends Controller
{
    public function __invoke(Timer $timer, TimerService $timerService)
    {
        Gate::authorize('update', $timer);

        abort_if(is_null($timer->task), 404);

        $timerService->startNew($timer->task, $timer->description);

        return redirect()->route('timers.index');
    }
}
