<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\File\FileController;
use App\Http\Controllers\Tasks\TaskController;
use App\Http\Controllers\Timers\TimerController;
use App\Http\Controllers\Clients\ClientController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Tasks\TaskFileController;
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Timers\TimerToggleController;
use App\Http\Controllers\Timers\TimeIntervalController;
use App\Http\Controllers\Projects\ProjectFileController;
use App\Http\Controllers\Tasks\TaskToggleArchiveController;
use App\Http\Controllers\Clients\ClientToggleArchiveController;
use App\Http\Controllers\Projects\ProjectToggleArchiveController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('time-entries', [TimerController::class, 'index'])->name('timers.index');
    Route::post('time-entries', [TimerController::class, 'store'])->name('timers.store');
    Route::patch('time-entries/{timer}', [TimerController::class, 'update'])->name('timers.update');
    Route::delete('time-entries/{timer}', [TimerController::class, 'destroy'])->name('timers.destroy');
    Route::patch('timers/{timer}/toggle', TimerToggleController::class)->name('timers-toggle.index');

    Route::patch('time-intervals/update-time/{timeInterval}', [TimeIntervalController::class, 'update'])->name('time-intervals.update');
    Route::delete('time-intervals/{timeInterval}', [TimeIntervalController::class, 'destroy'])->name('time-intervals.destroy');

    Route::resource('clients', ClientController::class)->except(['create', 'show', 'edit']);
    Route::patch('clients/{client}/toggle-archive', ClientToggleArchiveController::class)->name('clients.toggle-archive');

    Route::resource('projects', ProjectController::class)->except(['create', 'show', 'edit']);
    Route::patch('projects/{project}/toggle-archive', ProjectToggleArchiveController::class)->name('projects.toggle-archive');
    Route::post('projects/{project}/files', [ProjectFileController::class, 'store'])->name('projects.files.store');

    Route::resource('tasks', TaskController::class)->except(['create', 'show', 'edit']);
    Route::patch('tasks/{task}/toggle-archive', TaskToggleArchiveController::class)->name('tasks.toggle-archive');
    Route::post('tasks/{task}/files', [TaskFileController::class, 'store'])->name('tasks.files.store');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

    Route::prefix('files')->name('files.')->group(function () {
        Route::get('{file}/download', [FileController::class, 'download'])->name('download');
        Route::get('{file}/view', [FileController::class, 'show'])->name('show');
        Route::patch('{file}', [FileController::class, 'update'])->name('update');
        Route::delete('{file}', [FileController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
