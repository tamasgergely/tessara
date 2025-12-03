<?php

namespace App\Http\Controllers\Clients;

use App\Models\Client;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ClientToggleArchiveController extends Controller
{
    public function __invoke(Client $client)
    {
        DB::transaction(function () use ($client) {

            $archivedAt = $client->archived_at ? null : now();

            $client->update(['archived_at' => $archivedAt]);
            $client->projects()->update(['archived_at' => $archivedAt]);

            $client->tasks()->update(['archived_at' => $archivedAt]);
            $client->timers()->update(['timers.archived_at' => $archivedAt]);
        });


        return redirect()->route('clients.index');
    }
}
