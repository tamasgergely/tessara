<?php

namespace App\Http\Controllers\Timers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timer\TimerRecordRequest;
use App\Services\TimerService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class TimerRecordController extends Controller
{
    public function __invoke(TimerRecordRequest $request, TimerService $timerService)
    {
        return DB::transaction(function () use ($request, $timerService) {
            $task = $request->task();

            $endDate = $request->to < $request->from
                ? CarbonImmutable::parse($request->date)->addDay()->toDateString()
                : $request->date;

            $from = $request->user()->localMoment($request->date, $request->from);
            $to = $request->user()->localMoment($endDate, $request->to);

            $timerService->createStopped($task, $from, $to, $request->description);

            return redirect()->route('timers.index', ['date' => $request->date]);
        });
    }
}
