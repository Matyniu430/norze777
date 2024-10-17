<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'sent',
        'fulfilled',
        'canceled',
        'products_variants',
        'stripe_session_id',
        'stripe_customer_id'
    ];
    use HasFactory;
}
