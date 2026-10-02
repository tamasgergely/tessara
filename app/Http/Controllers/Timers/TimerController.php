<?php

namespace App\Http\Controllers\Timers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timer\TimerStoreRequest;
use App\Http\Requests\Timer\TimerUpdateRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\StuckTimerResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TimerResource;
use App\Models\Timer;
use App\Services\TimerService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class TimerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $today = now($user->timezone())->toDateString();
        [$start, $end] = rescue(
            fn() => $user->localDayBounds($request->date ?? $today),
            fn() => $user->localDayBounds($today),
            report: false,
        );

        return inertia('timers', [
            'timers' => TimerResource::collection(
                $user->timers()->forListing()->filterListing(['between' => [$start, $end]])->get()
            ),
            'tasks' => TaskResource::collection(
                $user->tasks()->forPicking()->get()
            ),
            'projects' => ProjectResource::collection(
                $user->projects()->forPicking()->get()
            ),
            'clients' => ClientResource::collection(
                $user->clients()->forPicking()->get()
            ),
            'stuckTimers' => StuckTimerResource::collection(
                $user->timers()->stuck()->with([
                    'task.client',
                    'timeIntervals' => function ($query) {
                        $query->orderBy('start');
                    }
                ])->get()
            )
        ]);
    }

    public function store(TimerStoreRequest $request, TimerService $service)
    {
        return DB::transaction(function () use ($request, $service) {

            $now = CarbonImmutable::now();

            $service->stopRunningIntervals($request->user(), $now);

            $taskId = $request->task_id;

            if (! $taskId) {
                $task = $request->user()->tasks()->create([
                    'name' => $request->task_name,
                    'project_id' => $request->project_id,
                    'client_id' => $request->client_id,
                ]);

                $taskId = $task->id;
            }

            $timer = $request->user()->timers()->create(
                [
                    'description' => $request->description,
                    'task_id' => $taskId,
                ]
            );

            $timer->timeIntervals()->create(['start' => $now]);

            return redirect()->route('timers.index');
        });
    }

    public function update(TimerUpdateRequest $request, Timer $timer)
    {
        Gate::authorize('update', $timer);

        $timer->task()->update([
            'name' => $request->task_name,
            'client_id' => $request->client_id,
            'project_id' => $request->project_id,
        ]);

        $timer->update([
            'description' => $request->description,
        ]);

        return redirect()->route('timers.index');
    }

    public function destroy(Timer $timer)
    {
        Gate::authorize('delete', $timer);

        $timer->delete();

        return redirect()->route('timers.index');
    }
}
