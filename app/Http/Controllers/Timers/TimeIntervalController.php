<?php

namespace App\Http\Controllers\Timers;

use App\Models\TimeInterval;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\TimeInterval\TimeIntervalUpdateRequest;
use Illuminate\Support\Facades\Gate;
use App\Services\TimeIntervalService;
use Illuminate\Validation\ValidationException;

class TimeIntervalController extends Controller
{
    public function update(TimeIntervalUpdateRequest $request, TimeInterval $timeInterval, TimeIntervalService $service): JsonResponse
    {
        Gate::authorize('update', $timeInterval);

        try {
            $interval = $service->updateIntervalTime(
                $timeInterval,
                $request->start,
                $request->stop
            );

            return response()->json($interval);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function destroy(TimeInterval $timeInterval)
    {
        Gate::authorize('delete', $timeInterval);

        $timeInterval->delete();

        return redirect()->route('timers.index');
    }
}
