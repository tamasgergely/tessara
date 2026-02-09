<?php

use App\Models\User;
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
        Schema::create('files', function (Blueprint $table) {
            $table->id();

            $table->morphs('fileable');

            $table->foreignIdFor(User::class)->constrained();

            $table->string('filename');
            $table->string('stored_filename');
            $table->string('path');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');

            $table->string('title')->nullable();
            $table->text('description')->nullable();

            $table->timestamps();

            $table->index(['fileable_type', 'fileable_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
