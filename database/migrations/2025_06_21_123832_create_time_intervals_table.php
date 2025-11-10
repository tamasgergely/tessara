<?php

use App\Models\Timer;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('time_intervals', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Timer::class)->constrained()->onDelete('cascade');

            $table->dateTime('start');
            $table->dateTime('stop')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_intervals');
    }
};
