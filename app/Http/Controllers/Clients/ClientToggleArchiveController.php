<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Support\Facades\Gate;

class ClientToggleArchiveController extends Controller
{
    public function __invoke(Client $client)
    {
        Gate::authorize('update', $client);

        $client->update(['archived_at' => $client->archived_at ? null : now()]);

        return redirect()->route('clients.index');
    }
}
