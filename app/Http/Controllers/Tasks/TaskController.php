<?php

namespace App\Http\Controllers\Tasks;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Task\TaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Task\TaskStoreRequest;
use App\Http\Requests\Task\TaskUpdateRequest;

class TaskController extends Controller
{
    public function index(TaskRequest $request)
    {
        $user = $request->user();

        $validated = $request->validated();

        return inertia('tasks', [
            'tasks' => TaskResource::collection(
                $user->tasks()
                    ->with([
                        'project',
                        'client',
                        'files' => function ($query) {
                            $query->orderBy('created_at', 'DESC');
                        },
                        'files.user'
                    ])
                    ->filterListing($validated)
                    ->paginate($request->user()->getPreference('pagination.tasks', 25))
                    ->withQueryString()
            ),
            'projects' => ProjectResource::collection(
                $user->projects()->forListing()->get()
            ),
            'clients' => ClientResource::collection(
                $user->clients()->forListing()->get()
            )
        ]);
    }

    public function store(TaskStoreRequest $request)
    {
        auth()->user()->tasks()->create($request->validated());

        return redirect()->route('tasks.index');
    }

    public function update(TaskUpdateRequest $request, Task $task)
    {
        Gate::authorize('update', $task);

        $task->update($request->safe()->toArray());

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return redirect()->back();
    }
}
