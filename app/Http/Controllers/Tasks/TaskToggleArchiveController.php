<?php

namespace App\Http\Controllers\Tasks;

use App\Models\Task;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class TaskToggleArchiveController extends Controller
{
    public function __invoke(Task $task)
    {
        DB::transaction(function () use ($task) {

            $archivedAt = $task->archived_at ? null : now();

            $task->update(['archived_at' => $archivedAt]);
            $task->timers()->update(['timers.archived_at' => $archivedAt]);
        });


        return redirect()->route('tasks.index');
    }
}
