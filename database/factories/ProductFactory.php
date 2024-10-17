<?php

namespace Database\Factories;

use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->name(),
            'price' => fake()->randomNumber(5),
            'vat_in_price' => fake()->boolean(),
            'description' => fake()->text(),
            'quantity' => fake()->numberBetween(2,60),
            'belt_length' => fake()->numberBetween(30,50),
            'length' => fake()->numberBetween(90,110),
            'size' => fake()->randomLetter(),
        ];
    }
}
