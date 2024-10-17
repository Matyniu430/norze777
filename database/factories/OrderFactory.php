<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'address' => fake()->address(),
            'price' => fake()->randomNumber(3),
            'fulfilled' => fake()->boolean(),
            'email' => fake()->email(),
            'name' => fake()->name(),
            'last_name' => fake()->lastName(),
            'product_id' => Product::factory()
        ];
    }
}
