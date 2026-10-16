<?php

namespace App\Http\Controllers\Timers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timer\TimerStoreRequest;
use App\Http\Requests\Timer\TimerUpdateRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\RecentTaskResource;
use App\Http\Resources\StuckTimerResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TimerResource;
use App\Models\Timer;
use App\Services\TimerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class TimerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $today = now($user->timezone())->toDateString();

        $validator = Validator::make($request->all(), [
            'date' => ['required', 'date_format:Y-m-d'],
        ]);

        $date = $validator->fails() ? $today : $request->date;

        [$start, $end] = $user->localDayBounds($date);

        $recentTasks = $date === $today ? $user->tasks()->recentlyUsed($start, $end)->limit(5)->get() : [];

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
            ),
            'recentTasks' => RecentTaskResource::collection($recentTasks),
            'today' => $today,
            'date' => $date
        ]);
    }

    public function store(TimerStoreRequest $request, TimerService $service)
    {
        return DB::transaction(function () use ($request, $service) {
            if (!$request->task_id) {
                $task = $request->user()->tasks()->create([
                    'name' => $request->task_name,
                    'project_id' => $request->project_id,
                    'client_id' => $request->client_id,
                ]);
            } else {
                $task = $request->user()->tasks()->findOrFail($request->task_id);
            }

            $service->startNew($task, $request->description);

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
