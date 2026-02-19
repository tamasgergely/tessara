<?php

namespace App\Http\Controllers\Projects;

use App\Models\Project;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectRequest;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Project\ProjectStoreRequest;
use App\Http\Requests\Project\ProjectUpdateRequest;

class ProjectController extends Controller
{
    public function index(ProjectRequest $request)
    {
        $user = $request->user();

        $validated = $request->validated();

        return inertia('projects', [
            'projects' => ProjectResource::collection(
                $user->projects()
                    ->with([
                        'client',
                        'tasks',
                        'files' => function ($query) {
                            $query->orderBy('created_at', 'DESC');
                        },
                        'files.user'
                    ])
                    ->filterListing($validated)
                    ->paginate($request->user()->getPreference('pagination.projects', 25))
                    ->withQueryString()
            ),
            'clients' => ClientResource::collection(
                $user->clients()->forListing()->get()
            )
        ]);
    }

    public function store(ProjectStoreRequest $request)
    {
        $request->user()->projects()->create($request->validated());

        return redirect()->route('projects.index');
    }

    public function update(ProjectUpdateRequest $request, Project $project)
    {
        Gate::authorize('update', $project);

        $project->update(
            $request->safe()->only(['name', 'client_id', 'description'])
        );

        return redirect()->back();
    }

    public function destroy(Project $project)
    {
        Gate::authorize('delete', $project);

        $project->delete();

        return redirect()->back();
    }
}
