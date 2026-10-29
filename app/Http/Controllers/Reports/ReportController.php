<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TimerResource;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Report\ReportRequest;

class ReportController extends Controller
{
    public function index(ReportRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();
        $groupedTimers = [];

        if (!empty($validated['date_range'])) {
            $validated['between'] = $user->localDayBounds(
                $validated['date_range']['start'],
                $validated['date_range']['end'],
            );
        }

        if (collect($validated)->filter()->isNotEmpty()) {
            $timers = $user
                ->timers()
                ->forListing(direction: 'asc')
                ->filterListing($validated)
                ->get()
                ->groupBy(fn($timer) => $timer->localDay($user->timezone()));

            $groupedTimers = $timers->map(function ($dayTimers, $date) {
                return [
                    'date' => $date,
                    'timers' => TimerResource::collection($dayTimers)
                ];
            })->values();
        }

        return inertia('reports', [
            'groupedTimers' => $groupedTimers,
            'clients' => ClientResource::collection(
                $user->clients()->forListing()->get()
            ),
            'projects' => ProjectResource::collection(
                $user->projects()->forListing()->get()
            ),
            'tasks' => TaskResource::collection(
                $user->tasks()->forListing()->get()
            ),
        ]);
    }
}
