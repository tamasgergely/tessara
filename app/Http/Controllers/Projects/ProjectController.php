<?php

namespace App\Http\Controllers\Projects;

use App\Models\Client;
use App\Models\Project;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Project\ProjectStoreRequest;
use App\Http\Requests\Project\ProjectUpdateRequest;

class ProjectController extends Controller
{
    public function index()
    {
        return inertia('projects', [
            'projects' => ProjectResource::collection(
                auth()->user()->projects()->forListing(includeArchived: true)->get()
            ),
            'clients' => ClientResource::collection(
                auth()->user()->clients()->forListing()->get()
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
                + ['archived_at' => $request->boolean('archived') ? now() : null]
        );

        return redirect()->route('projects.index');
    }

    public function destroy(Project $project)
    {
        Gate::authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index');
    }
}
