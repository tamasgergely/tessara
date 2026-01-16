<?php

namespace App\Http\Controllers\Projects;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ProjectToggleArchiveController extends Controller
{
    public function __invoke(Project $project)
    {
        DB::transaction(function () use ($project) {

            $archivedAt = $project->archived_at ? null : now();

            $project->update(['archived_at' => $archivedAt]);
            $project->tasks()->update(['archived_at' => $archivedAt]);
            $project->timers()->update(['timers.archived_at' => $archivedAt]);
        });


        return redirect()->route('projects.index');
    }
}
