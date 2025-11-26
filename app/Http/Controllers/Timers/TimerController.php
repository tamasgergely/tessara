<?php

namespace App\Http\Controllers\Timers;

use App\Models\Timer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\TimerResource;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Timer\TimerStoreRequest;
use App\Http\Requests\Timer\TimerUpdateRequest;

class TimerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return inertia('timers', [
            'timers' => TimerResource::collection(
                $user->timers()->forListing()->filterListing(['date' => $request->date ?? today()])->get()
            ),
            'tasks' => TaskResource::collection(
                $user->tasks()->forListing()->get()
            ),
            'projects' => ProjectResource::collection(
                $user->projects()->forListing()->get()
            ),
            'clients' => ClientResource::collection(
                $user->clients()->forListing()->get()
            ),
        ]);
    }

    public function store(TimerStoreRequest $request)
    {
        return DB::transaction(function () use ($request) {

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

            $timer->timeIntervals()->create(['start' => now()]);

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
