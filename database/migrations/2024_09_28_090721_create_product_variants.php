<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('size')->nullable();
            $table->integer('quantity');
            $table->string('length')->nullable();
            $table->string('product_stripe_id');
            $table->string('price_stripe_id');
            $table->string('belt_length')->nullable();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
