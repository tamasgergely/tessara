<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class HeartbeatController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'now' => Carbon::now()->format('Y-m-d\TH:i:s.v\Z'),
        ]);
    }
}
