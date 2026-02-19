<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PreferencesController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pagination_tasks' => ['nullable', 'integer', Rule::in([25, 50, 100])],
            'pagination_projects' => ['nullable', 'integer', Rule::in([25, 50, 100])],
            'pagination_clients' => ['nullable', 'integer', Rule::in([25, 50, 100])],
        ]);

        foreach ($validated as $key => $value) {
            if ($value !== null) {
                $request->user()->setPreference(str_replace('_', '.', $key), $value);
            }
        }

        return redirect()->back();
    }
}
