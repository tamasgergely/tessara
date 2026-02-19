<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\ClientStoreRequest;
use App\Http\Requests\Client\ClientUpdateRequest;
use App\Http\Requests\Clients\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Support\Facades\Gate;

class ClientController extends Controller
{
    public function index(ClientRequest $request)
    {
        $validated = $request->validated();

        return inertia('clients', [
            'clients' => ClientResource::collection(
                auth()
                    ->user()
                    ->clients()
                    ->filterListing($validated)
                    ->paginate($request->user()->getPreference('pagination.clients', 25))
                    ->withQueryString()
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

        $client->update(['name' => $request->name]);

        return redirect()->back();
    }

    public function destroy(Client $client)
    {
        Gate::authorize('delete', $client);

        $client->delete();

        return redirect()->back();
    }
}
