<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Gate;

class ProjectToggleArchiveController extends Controller
{
    public function __invoke(Project $project)
    {
        Gate::authorize('update', $project);

        $project->update(['archived_at' => $project->archived_at ? null : now()]);

        return redirect()->back();
    }
}
