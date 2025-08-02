<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('entry_text');
            $table->string('mood')->nullable();
            $table->text('ai_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('journal_entries');
    }
};
