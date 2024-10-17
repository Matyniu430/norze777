<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItems;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Spatie\MediaLibrary\Support\FileRemover\DefaultFileRemover;
use Spatie\MediaLibrary\MediaCollections\Filesystem;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Support\Facades\Session;

class ProductController extends Controller
{   
    public function index()
    {
        $products = Product::all();
        $images = [];
        foreach ($products as $product) {
            $image = $product->getFirstMedia("images");
            $imageUrl = $image->getUrl('original');
            $images[$product->id] = $imageUrl;
        }
        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'images' => $images
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $product_data = $request->validate([
            'name' => 'required|max:50',
            'quantity' => 'required|integer|min:-1',
            'price' => 'required|integer',
            'description' => 'required',
            'belt_lengths' => 'nullable|array',
            'sizes' => 'nullable|array',
            'lengths' => 'nullable|array',
            'product_variants' => 'required|array'
        ]);
        $product_variants = $product_data['product_variants'];
        $images = $request->validate([
            'images' => 'required|array'
        ]);

        if (isset($product_data['belt_lengths'])) {
            $product_data['belt_lengths'] = $product_data['belt_lengths'];
        }

        if (isset($product_data['lengths'])) {
            $product_data['lengths'] = $product_data['lengths'];
        }

        if (isset($product_data['sizes'])) {
            $product_data['sizes'] = $product_data['sizes'];
        }

        $product = Product::create($product_data);
        foreach ($images['images'] as $file) {
            $product
                ->addMedia($file->getPathname())
                ->toMediaCollection('images', 's3');
        }
        $stripeProductImageUrl = $product->getFirstMedia('images')->getUrl('original');
        $this->setVariants($product_variants, $product, $stripeProductImageUrl);
        return redirect('/dashboard/products');
    }

    public function show(Request $request, string $name)
    {
        $product = Product::where('name', '=', $name)->first();
        if ($product) {
            $product_variants = ProductVariant::where('product_id', $product->id)
                ->select('belt_length', 'size', 'length', 'quantity', 'id')
                ->get();

            $images = $product->getMedia("images");
            $imagesUrls = [];
            foreach ($images as $image) {
                $imagesUrls[] = $image->getUrl("original");
            }

            $session_id = Session::getId();
            $cart = Cart::where('session_id', $session_id)->first();
            $cart_item = [];
            $cartDataToReturn = null;
            if ($cart) {
                $cart_item = CartItems::where('cart_id', $cart->id)->first();
                if ($cart_item) {
                    $cartDataToReturn = ["items" => $cart_item['items']];
                } else {
                    $cartDataToReturn = null;
                }
            }
            $variant_id = $request->query('variantId');
            $selectedVariant = null;
            if ($variant_id) {
                foreach ($product_variants as $variant) {
                    if (intval($variant_id) === $variant->id) {
                        $selectedVariant = $variant;
                        break;
                    }
                }
            }
            return Inertia::render("Client/SingleProduct", [
                'product' => $product,
                'images' => $imagesUrls,
                'variants' => $product_variants,
                'cart' => $cartDataToReturn,
                'selectedVariant' => $selectedVariant
            ]);
        } else {
            return 'not found';
        }
    }

    public function edit(Product $product)
    {
        $mediaImages = $product->getMedia('images');
        $imagesUrls = [];

        foreach ($mediaImages as $file) {
            $imagesUrls[] = $file->getUrl();
        }
        if ($product) {
            $product_variants = ProductVariant::where('product_id', $product->id)
                ->select('belt_length', 'size', 'length', 'quantity', 'id')
                ->get();
            return Inertia::render("Admin/Products/Edit", [
                'product' => $product,
                'images' => $imagesUrls,
                'variants' => $product_variants
            ]);
        } else {
            return redirect('/dashboard/products');
        }
    }

    public function update(Request $request, Product $product)
    {
        $new_product_data = $request->validate([
            'name' => 'required|max:50',
            'quantity' => 'required|integer|min:-1',
            'price' => 'required|integer',
            'description' => 'required',
            'belt_lengths' => 'nullable|array',
            'sizes' => 'nullable|array',
            'lengths' => 'nullable|array',
            'product_variants' => 'required|array'
        ]);
        $product_variants = $new_product_data['product_variants'];
        $updated_product_data = array();
        foreach ($new_product_data as $key => $new_product_value) {
            if (gettype($new_product_value) === "array" && !is_null($product[$key])) {
                if (!empty(array_diff($new_product_value, $product[$key]))) {
                    $updated_product_data[$key] = $new_product_value;
                }
            } else {
                if ($new_product_value !== $product[$key]) {
                    $updated_product_data[$key] = $new_product_value;
                }
            }
        }
        $product->update($updated_product_data);

        $new_product_images = $request->validate([
            'images' => 'required|array'
        ]);
        $old_product_images = $product->getMedia("images");
        $old_images_hashes = [];
        $new_images_arr = [];

        foreach ($new_product_images['images'] as $new_image) {
            $temp_new_image = tmpfile();
            $meta_data = stream_get_meta_data($temp_new_image);
            $temp_new_path = $meta_data['uri'];
            fwrite($temp_new_image, file_get_contents($new_image->getPathname()));
            $new_image_hash = md5_file($temp_new_path);
            fclose($temp_new_image);
            $new_images_arr[$new_image_hash] = [
                "file" => $new_image,
                "hash" => $new_image_hash
            ];
        }

        $mediaIndex = 0;
        foreach ($old_product_images as $old_image) {
            $old_image_url = $old_image->getUrl('original');
            $temp_old_image = tmpfile();
            $meta_data_old = stream_get_meta_data($temp_old_image);
            $temp_old_path = $meta_data_old['uri'];
            $response = Http::get($old_image_url);
            fwrite($temp_old_image, $response->body());
            $old_image_hash = md5_file($temp_old_path);
            fclose($temp_old_image);
            $old_images_hashes[$mediaIndex] = $old_image_hash;
            $mediaIndex++;
        }

        $new_hashes_only = array_column($new_images_arr, 'hash');
        foreach ($new_hashes_only as $new_image_hash) {
            if (!in_array($new_image_hash, $old_images_hashes)) {
                $fileToAdd = $new_images_arr[$new_image_hash]['file'];
                $product
                    ->addMedia($fileToAdd->getPathName())
                    ->toMediaCollection("images", "s3");
            }
        }
        foreach ($old_images_hashes as $old_image_media_key => $old_image_hash) {
            if (!in_array($old_image_hash, $new_hashes_only)) {
                $filesystem = app(Filesystem::class);
                $filesystemFactory = app(FilesystemFactory::class);
                $fileRemover = new DefaultFileRemover($filesystem, $filesystemFactory);
                $media = $old_product_images[$old_image_media_key];
                $fileRemover->removeFromConversionsDirectory($media, 's3');
                $media->delete();
            }
        }
        $stripeProductImageUrl = $product->getFirstMedia('images')->getUrl('original');
        $this->setVariants($product_variants, $product, $stripeProductImageUrl);
        return redirect('/dashboard/products');
    }

    public function destroy(Product $product)
    {   
        if ($product) {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $productVariantsToDeactivate = ProductVariant::where('product_id', $product->id)->get();
            foreach ($productVariantsToDeactivate as $variantToDeactivate) {
                $priceIdToDeactivate = $stripe->prices->all([
                    'limit' => 1,
                    'product' => $variantToDeactivate['product_stripe_id']
                ])->data[0]->id;
                $stripe->products->update($variantToDeactivate->product_stripe_id,[
                    'active' => false
                ]);
                $stripe->prices->update($priceIdToDeactivate,[
                    'active' => false
                ]);
            }
            $product->delete();
            
        }
        return redirect('/dashboard/products');
    }

    private function createProductVariantAndStripeProduct ($product, $variantData,$stripe_product_template, $description, $isSizeVariant = false) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripeProductData = array_merge($stripe_product_template, ['description' => $description,]);
        $stripeCreatedProduct = $stripe->products->create($stripeProductData);
        $stripeCreatedProductPriceId = $stripe->prices->all(
            [
                'limit' => 1,
                'product' => $stripeCreatedProduct['id']
            ]
        )->data[0]->id;

        ProductVariant::create([
            'product_id' => $product->id,
            'quantity' => $variantData['quantity'],
            'size' => $isSizeVariant ? $variantData['size'] : null,
            'belt_length' => !$isSizeVariant ? $variantData['belt_length'] : null,
            'length' => !$isSizeVariant ? $variantData['length'] : null,
            'product_stripe_id' => $stripeCreatedProduct['id'],
            'price_stripe_id' => $stripeCreatedProductPriceId
        ]);
    }

    private function setVariants($product_variants, $product, $productImage)
    {      
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $DBproductVariants = ProductVariant::where('product_id', $product->id)->get()->toArray();
        function matchVariant($variant, $dbVariant)
        {
            $matchLengthAndBeltLength =
                isset($variant['length'], $variant['belt_length'], $dbVariant['length'], $dbVariant['belt_length'])
                && $variant['length'] === $dbVariant['length']
                && $variant['belt_length'] === $dbVariant['belt_length'];

            $matchSize = isset($variant['size'], $dbVariant['size'])
                && $variant['size'] === $dbVariant['size'];

            return $matchLengthAndBeltLength || $matchSize;
        }

        function quantityDifferent($variant, $dbVariant)
        {
            return isset($variant['quantity'], $dbVariant['quantity']) && intval($variant['quantity']) !== intval($dbVariant['quantity']);
        }
        $newVariants = array_filter($product_variants, function ($variant) use ($DBproductVariants) {
            foreach ($DBproductVariants as $dbVariant) {
                if (matchVariant($variant, $dbVariant)) {
                    return false;
                }
            }
            return true;
        });

        $missingVariants = array_filter($DBproductVariants, function ($dbVariant) use ($product_variants) {
            foreach ($product_variants as $variant) {
                if (matchVariant($variant, $dbVariant)) {
                    return false;
                }
            }
            return true;
        });

        $variantsToUpdate = array_filter($product_variants, function ($variant) use ($DBproductVariants) {
            foreach ($DBproductVariants as $dbVariant) {
                if (!matchVariant($variant, $dbVariant) && quantityDifferent($variant, $dbVariant)) {
                    return true;
                }
            }
            return false;
        });

        foreach ($missingVariants as $missingVariant) {
            $productVariantToDelete = ProductVariant::where('id', $missingVariant['id'])->first();
            $stripe->products->update($productVariantToDelete->product_stripe_id,[
                'active' => false
            ]);
            $stripe->prices->update($productVariantToDelete->price_stripe_id,[
                'active' => false
            ]);
            $productVariantToDelete->delete();
        }

        foreach ($variantsToUpdate as $variantToUpdate) {
            $dbVariantToUpdate = null;
            if (isset($variantToUpdate['belt_length']) && isset($variantToUpdate['length'])) {
                $dbVariantToUpdate = ProductVariant::where('product_id', $product->id)->where('belt_length', $variantToUpdate['belt_length'])->where('length', $variantToUpdate['length'])->first();
              
            }
            else if (isset($variantToUpdate['size'])) {
                $dbVariantToUpdate = ProductVariant::where('product_id', $product->id)->where('size',$variantToUpdate['size'])->first();
            }
            $dbVariantToUpdate->quantity = $variantToUpdate['quantity'];
            $dbVariantToUpdate->save();
        }
        $lengthsCount = 0;
        $sizesCount = 0;

        if (isset($product_variants[0]['length'])) {
            $lengthsCount = count($product_variants);
        } else if (isset($product_variants[0]['size'])) {
            $sizesCount = count($product_variants);
        }
        if (count($DBproductVariants) === 0 || count($newVariants) > 0) {
            foreach ($newVariants as $variant) {
                $stripe_product_template = [
                    'name' => $product->name,
                    'default_price_data' => [
                        'currency' => 'PLN',
                        'tax_behavior' => 'inclusive',
                        'unit_amount' => intval($product->price) * 100,
                    ],
                    'shippable' => true,
                    'images' => [$productImage],
                ];
                
                if ($lengthsCount > 0) {
                    $this->createProductVariantAndStripeProduct($product, $variant,$stripe_product_template,$variant['belt_length'] . ' / ' . $variant['length']);
                } else if ($sizesCount > 0) {
                    $this->createProductVariantAndStripeProduct($product, $variant,$stripe_product_template,$variant['size'], true);
                }
            }
        }

        $updatedDBProductVariants = ProductVariant::where('product_id', $product->id)->get()->toArray();

        function getUniqueValues($variants, $key)
        {
            return array_unique(array_filter(array_map(function ($variant) use ($key) {
                return $variant[$key] ?? null;
            }, $variants)));
        }

        function getNewValues($productProperty, $updatedValues)
        {
            $newValues = [];
            foreach ($productProperty as $item) {
                if (!in_array($item, $updatedValues)) {
                    foreach ($productProperty as $compareItem) {
                        if ($item !== $compareItem) {
                            $newValues[] = $compareItem;
                        }
                    }
                }
            }
            return array_unique($newValues);
        }

        $lengths = getUniqueValues($updatedDBProductVariants, 'length');
        $belt_lengths = getUniqueValues($updatedDBProductVariants, 'belt_length');
        $sizes = getUniqueValues($updatedDBProductVariants, 'size');

        $productToUpdate = Product::find($product->id); // Use find for better readability

        $productProperties = [
            'lengths' => $lengths,
            'belt_lengths' => $belt_lengths,
            'sizes' => $sizes,
        ];
        foreach ($productProperties as $property => $updatedValues) {
            if (isset($productToUpdate->{$property}) && count($updatedValues) > 0) {
                $filteredValues = getNewValues($productToUpdate->{$property}, $updatedValues);
                if (count($filteredValues) > 0) {
                    $productToUpdate->{$property} = $filteredValues;
                }
            } else if (count($updatedValues) !== 0) {
                $productToUpdate->{$property} = $updatedValues;
            } else {
                $productToUpdate->{$property} = null;
            }
        }
        $productToUpdate->save();
    }

}
