<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Tasks\TaskController;
use App\Http\Controllers\Timers\TimerController;
use App\Http\Controllers\Clients\ClientController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Timers\TimerToggleController;
use App\Http\Controllers\Timers\TimeIntervalController;

Route::get('/asdf', function (){
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('time-entries', [TimerController::class, 'index'])->name('timers.index');
    Route::post('time-entries', [TimerController::class, 'store'])->name('timers.store');
    Route::patch('time-entries/{timer}', [TimerController::class, 'update'])->name('timers.update');
    Route::delete('time-entries/{timer}', [TimerController::class, 'destroy'])->name('timers.destroy');

    Route::patch('timers/{timer}/toggle', TimerToggleController::class)->name('timers-toggle.index');

    Route::patch('time-intervals/update-time/{timeInterval}', [TimeIntervalController::class, 'update'])->name('time-intervals.update');
    Route::delete('time-intervals/{timeInterval}', [TimeIntervalController::class, 'destroy'])->name('time-intervals.destroy');

    Route::resource('clients', ClientController::class)->except(['create','show','edit']);
    Route::resource('projects', ProjectController::class)->except(['create','show','edit']);
    Route::resource('tasks', TaskController::class)->except(['create','show','edit',]);

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
