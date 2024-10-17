<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductVariant extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id',
        'size',
        'length',
        'belt_length',
        'quantity',
        'product_stripe_id',
        'price_stripe_id'
        // Add other columns...
    ];

    public function Product() : HasOne
    {
        return $this->hasOne(Product::class);
    }
}
