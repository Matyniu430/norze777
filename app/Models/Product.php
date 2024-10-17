<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'images',
        'quantity',
        'price',
        'description',
        'belt_lengths',
        'sizes',
        'lengths',
        'images'
    ];

    protected $casts = [
        'belt_lengths' => 'array',
        'lengths' => 'array',
        'sizes' => 'array',
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('original')
            ->format('webp')
            ->nonQueued();
    }
}
