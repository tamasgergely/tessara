<?php

namespace App\Http\Controllers\Clients;

use App\Models\Client;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\ClientResource;
use App\Http\Requests\Client\ClientStoreRequest;
use App\Http\Requests\Client\ClientUpdateRequest;

class ClientController extends Controller
{
    public function index()
    {
        return inertia('clients', [
            'clients' => ClientResource::collection(
                auth()->user()->clients()->forListing(includeArchived: true)->get()
            )
        ]);
    }

    public function store(ClientStoreRequest $request)
    {
        $request->user()->clients()->create($request->validated());

        return redirect()->route('clients.index');
    }

    public function update(ClientUpdateRequest $request, Client $client)
    {
        Gate::authorize('update', $client);

        $client->update([
            'name' => $request->name,
            'archived_at' => $request->archived ? now() : null
        ]);

        return redirect()->route('clients.index');
    }

    public function destroy(Client $client)
    {
        Gate::authorize('delete', $client);

        $client->delete();

        return redirect()->route('clients.index');
    }
}
