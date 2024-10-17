<?php

use App\Http\Controllers\ProductController;
use App\Models\Cart;
use App\Models\CartItems;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Stripe\Customer;

Route::get('/cart', function (Request $request) {
    $session_id = Session::getId();
    $cart = Cart::where('session_id', $session_id)->first();
    $inertiaCartItems = [];
    if (!$cart || !CartItems::where('cart_id', $cart->id)->first()) {
        return Inertia::render('Client/Cart', [
            "cart" => null
        ]);
    }
    $cart_items = CartItems::where('cart_id', $cart->id)->first();
    $items = $cart_items['items'];
    $inertiaCartItems = [];
    $checkedVariants = [];
    if (empty($items)) {
        $cart = null;
    } else {
        foreach ($items as $cart_item) {
            if (!in_array($cart_item['variant_id'], $checkedVariants)) {
                $entryProduct = Product::find($cart_item['product_id']);
                $entryVariant = ProductVariant::find($cart_item['variant_id']);
                $checkedVariants[] = $cart_item['variant_id'];
                $previewImageUrl = optional($entryProduct->getMedia("images")->first())->getUrl("original");
                $sameItems = array_filter($items, function ($item) use ($cart_item) {
                    if ($item['variant_id'] === $cart_item['variant_id']) {
                        return true;
                    }
                    return false;
                });
                $totalQuantity = 0;
                foreach ($sameItems as $item) {
                    $totalQuantity += $item['quantity'];
                }
                $inertiaCartItems[] = [
                    "cart_items_id" => $cart_items->id,
                    "name" => $entryProduct->name,
                    "price" => $entryProduct->price,
                    "belt_length" => $entryVariant->belt_length,
                    "length" => $entryVariant->length,
                    "variant_id" => $entryVariant->id,
                    "size" => $entryVariant->size,
                    "product_id" => $entryProduct->id,
                    "quantity" => $totalQuantity,
                    "previewImageUrl" => $previewImageUrl
                ];
            }
        }
    }
    return Inertia::render('Client/Cart', [
        "cart" => empty($inertiaCartItems) ? null : [
            "items" => $inertiaCartItems
        ]
    ]);
});

Route::get('/cart/length', function (Request $request) {
    $session_id = Session::getId();
    $cart = Cart::where('session_id', $session_id)->first();
    if (!$cart) {
        return response()->json([
            'count' => 0
        ]);
    }
    $cart_items = CartItems::where('cart_id', $cart->id)->first();
    if (!$cart_items) {
        return response()->json([
            'count' => 0
        ]);
    }
    $totalCount = 0;
    foreach ($cart_items->items as $item) {
        $totalCount += $item['quantity'];
    }
    return response()->json([
        'count' => $totalCount
    ]);
});

Route::post('/cart/{product}/{variant}', function (Request $request, Product $product, ProductVariant $variant) {
    $request->validate([
        'quantity' => "required|numeric|min:1"
    ]);
    $session_id = Session::getId();
    $cart = Cart::firstOrCreate(
        ["session_id" => $session_id],
    );;
    $items[] = array(
        "product_id" => $product->id,
        "variant_id" => $variant->id,
        "quantity" => $request->get('quantity')
    );
    $cart_item = CartItems::firstOrCreate(
        ['cart_id' => $cart->id],
        [
            'items' => $items,
        ]

    );
    if (!$cart_item->wasRecentlyCreated) {
        foreach ($cart_item->items as $key => $item) {
            if ($item['variant_id'] === $variant) {
                dd($key);
            }
        }
        $items = array_merge($items, $cart_item->items);
    }

    $cart_item->update(
        [
            'items' => $items
        ]
    );
    $dataToReturn = getSingleProductOutputData($cart_item, $product);
    return response([
        'items' => $dataToReturn['items'],
        'itemsCount' => $dataToReturn['allItemsQuantity']
    ]);
});

Route::delete('/cart/{cart_items}/{variant}', function (
    Request $request,
    CartItems $cart_items,
    ProductVariant $variant
) {


    $cartItemsToSave = array_filter($cart_items->items, function ($item) use ($variant) {
        if (
            $item['variant_id'] === $variant['id']
        ) {
            return false;
        }
        return true;
    });

    $cart_items->update([
        'items' => array_merge($cartItemsToSave, [])
    ]);

    return response(null, 204);
});
Route::put('/cart/{cart_items}/{variant}', function (
    Request $request,
    CartItems $cart_items,
    ProductVariant $variant
) {
    $data = $request->validate([
        'quantity' => 'required|numeric|min:0'
    ]);

    $quantity = $data['quantity'];

    $remaining_cart_items = [];
    $cart_item_to_update = null;

    foreach ($cart_items->items as $item) {
        if ($item['variant_id'] === $variant['id']) {
            $cart_item_to_update = $item;
        } else {
            $remaining_cart_items[] = $item;
        }
    }
    if ($cart_item_to_update === null) {
        return response()->json(['error' => 'Item not found in cart'], 404);
    }

    $productVariant = ProductVariant::find($cart_item_to_update['variant_id']);
    $availableQuantity = ($productVariant->quantity !== -1) ? $productVariant->quantity : $cart_item_to_update['quantity'] + ($quantity - $cart_item_to_update['quantity']);

    if ($availableQuantity < $quantity) {
        return response()->json(['error' => 'The requested quantity exceeds available quantity'], 400);
    }

    if ($quantity === 0) {
        $cart_items->update(['items' => $remaining_cart_items]);
        return response()->noContent();
    } else {
        $cart_item_to_update['quantity'] = $quantity;
        $cart_items->update(['items' => array_merge($remaining_cart_items, [$cart_item_to_update])]);
        return response(null, 200);
    }
});


Route::get('/dynamic-search', function (Request $request) {
    $searchValue = $request->query("value");
    $products = Product::where('name', 'LIKE', "%{$searchValue}%")->get();
    $inertiaProductsArr = [];
    foreach ($products as $product) {
        $productImages = $product->getMedia('images');
        $previewImgUrl = $productImages[0]->getUrl('original');
        $inertiaProductsArr[] = [
            "name" => $product->name,
            "previewImgUrl" => $previewImgUrl
        ];
    }
    $productsArr = count($inertiaProductsArr) ? $inertiaProductsArr : null;
    return response([
        "products" => $productsArr
    ]);
});

Route::get('/check', function () {
    return Inertia::render('Client/CheckoutSuccess');
});

Route::post('/checkout', function (Request $request) {
    $data = $request->validate([
        "items" => 'required|array'
    ]);
    $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
    $customer_id = $request->cookie("customer_id");
    $checkout_session = $request->cookie("checkout_session");
    $stripe_customer = null;
    $stripe_checkout_session = null;
    $request_cart_items = [];
    $has_session = false;
    $checkout_url = null;
    $cart_total_price = 0;
    foreach ($data['items'] as $cart_item) {
        $productVariant = ProductVariant::where('id', $cart_item['variantId'])->first();
        $price = Product::where('id', $productVariant->product_id)->pluck('price')->first();
        $cart_total_price += $price * 100;
        $cart_item_obj = [
            'price' => $productVariant->price_stripe_id,
            'quantity' => $cart_item['quantity']
        ];
        $request_cart_items[] = $cart_item_obj;
    }
    if ($customer_id) {
        $stripe_customer = $stripe->customers->retrieve($customer_id);
    }
    if ($checkout_session) {
        $stripe_checkout_session = $stripe->checkout->sessions->retrieve($checkout_session);
        if ((
                ($stripe_customer && $stripe_checkout_session->customer_email === $stripe_customer->email) ||
                !$stripe_customer)
            && $stripe_checkout_session->status === 'expired'
        ) {
            $stripe_checkout_session_cart = $stripe->checkout->sessions->allLineItems($checkout_session);
            $newRequestCartItems = array_filter($request_cart_items, function ($cart_item) use ($stripe_checkout_session_cart) {
                foreach ($stripe_checkout_session_cart->data as $stripe_cart_item) {
                    if (
                        $stripe_cart_item->price->id === $cart_item['price'] &&
                        $stripe_cart_item->quantity === $cart_item['quantity']
                    ) {
                        return false;
                    } else if (
                        $stripe_cart_item->price->id === $cart_item['price'] &&
                        $stripe_cart_item->quantity !== $cart_item['quantity']
                    ) {
                        return true;
                    }
                }
                return true;
            });
            if (count($newRequestCartItems) > 0) {
                $has_session = false;
                if ($stripe_checkout_session->status === 'open') {
                    $stripe->checkout->sessions->expire($checkout_session);
                }
            } else $has_session = true;
        }
    }
    if (!$has_session) {
        $payment_intent = $stripe->paymentIntents->create([
            'amount' => $cart_total_price,
            'currency' => 'pln',
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'always'
            ]
        ]);
        $checkout_session_data = [
            'success_url' => 'http://127.0.0.1:8000/checkout/success/process?session_id={CHECKOUT_SESSION_ID}',
            'line_items' => $request_cart_items,
            'mode' => 'payment',
            'payment_intent' => $payment_intent,
            "phone_number_collection" => [
                "enabled" => true
            ],
            'shipping_address_collection' => [
                "allowed_countries" => ["PL"],
            ],
            'shipping_options' => [
                [
                    'shipping_rate' => "shr_1Q8STOJukPQOMVVVqJfodt7C"
                ],
                [
                    'shipping_rate' => "shr_1Q8ST1JukPQOMVVVZ4MRhN2G"
                ]
            ]
        ];
        if ($stripe_customer) {
            $checkout_session_data[] = [
                "customer" => $customer_id
            ];
        } else {
            $checkout_session_data[] = [
                "customer_creation" => "always"
            ];
        }
        $session = $stripe->checkout->sessions->create($checkout_session_data);
        $checkout_url = $session->url;
        $checkout_session_cookie = cookie('checkout_session', $session->id, 0);
        dd($session->payment_intent,0);
        return response([
            'url' => $checkout_url
        ])->withCookie($checkout_session_cookie);
    } else {
        $checkout_url = $stripe_checkout_session->url;
        return response([
            'url' => $checkout_url
        ]);
    }
})->name('checkout');

Route::get('/checkout/success/process', function (Request $request) {
    $checkout_session_id = $request->query('session_id');
    $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
    $checkout_session = $stripe->checkout->sessions->retrieve($checkout_session_id);
    if ($checkout_session) {
        $customer_id_cookie = cookie('customer_id', $checkout_session->customer, 0);
        return redirect('checkout/success/complete?session_id=' . $checkout_session_id)
            ->cookie($customer_id_cookie);
    }
});

Route::get('/checkout/success/complete', function (Request $request) {
    $checkout_session_id = $request->query('session_id');
    if ($checkout_session_id) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $checkout_session = $stripe->checkout->sessions->retrieve($checkout_session_id);
        if ($checkout_session) {
            if ($checkout_session->payment_status === "paid") {
                $session_cart_items = [];
                $shipping_address_details = [];
                $shipping_method = $stripe
                    ->shippingRates
                    ->retrieve($checkout_session
                        ->shipping_cost->shipping_rate)->display_name;
                $shipping_address_details['name'] = $checkout_session->shipping_details->name;
                foreach ($checkout_session->shipping_details->address->toArray() as $key => $detail) {
                    if ($detail !== null) {
                        $shipping_address_details[$key] = $detail;
                    }
                }

                $total = $checkout_session->amount_total / 100;
                $subtotal = $checkout_session->amount_subtotal / 100;
                $shipping_cost = $checkout_session->shipping_cost->amount_total / 100;
                $taxes = $checkout_session->total_details->amount_tax / 100;
                $session_items = $stripe->checkout->sessions->allLineItems($checkout_session_id, [
                    'limit' => 100
                ]);
                $existing_order = Order::where('stripe_session_id', $checkout_session_id)->first();
                $variants_in_checkout_session = [];
                if (!$existing_order) {
                    foreach ($session_items->data as $session_item) {
                        $product = $stripe->products->retrieve($session_item->price->product);
                        $productVariantToUpdate = ProductVariant::where('product_stripe_id', $product->id)->first();
                        $productVariantToUpdate->quantity -= $session_item->quantity;
                        $variants_in_checkout_session[] = [
                            "variant_id" => $productVariantToUpdate->id,
                            "quantity" => $session_item->quantity
                        ];
                        $productVariantToUpdate->save();
                        $session_id = $request->session()->getId();
                        Cart::where('session_id', $session_id)->delete();
                    }
                }
                foreach ($session_items->data as $session_item) {
                    $product = $stripe->products->retrieve($session_item->price->product);
                    $session_cart_items[] = [
                        "name" => $session_item->description,
                        "description" => $product->description,
                        "total" => $session_item->amount_total / 100,
                        "quantity" => $session_item->quantity,
                        "image" => $product->images[0]
                    ];
                }
                $shippingObj = [
                    'addressDetails' => $shipping_address_details,
                    'cost' => $shipping_cost,
                    'method' => $shipping_method
                ];
                $customerObj = [
                    'email' => $checkout_session->customer_details->email,
                    'phone' => $checkout_session->customer_details->phone,
                    'id' => $checkout_session->customer
                ];
                if (!$existing_order) {
                    $order_obj = [
                        'sent' => false,
                        'fulfilled' => false,
                        'canceled' => false,
                        'stripe_session_id' => $checkout_session_id,
                        'stripe_customer_id' => $checkout_session->customer,
                        'products_variants' => json_encode($variants_in_checkout_session)
                    ];
                    Order::create($order_obj);
                }
                return Inertia::render('Client/CheckoutSuccess', [
                    'checkoutItems' => $session_cart_items,
                    'subtotal' => $subtotal,
                    'customer' => $customerObj,
                    'taxes' => $taxes,
                    'total' => $total,
                    'shipping' => $shippingObj,
                ]);
            }
        }
    }
});


Route::get('/checkout-cancel', function (Request $request) {
    return 'no thanks';
})->name('checkout-cancel');

Route::get('/token', function (Request $request) {
    $token = csrf_token();
    $cookie = cookie("XSRF-TOKEN", $token, 0);
    return response()->noContent()->withCookie($cookie);
});

Route::get('/', function () {
    $products = Product::all();
    $images = [];
    foreach ($products as $product) {
        $imagesToAdd = [];
        $imagesArr = $product->getMedia("images");
        $imagesToAdd[] = $imagesArr[0]->getUrl('original');
        if (isset($imagesArr[1])) {
            $imagesToAdd[] = $imagesArr[1]->getUrl('original');
        }
        $images[$product->id] = $imagesToAdd;
    }

    return Inertia::render('Client/Landing', [
        "products" => $products,
        "images" => $images
    ]);
});

Route::get('/products/{name}', [ProductController::class, 'show'])->name('product-show');

Route::get('/checkout-test', function () {
    return Inertia::render("Client/Checkout");
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
    Route::get('/dashboard/orders', function (Request $request) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $orders = Order::all();
        $ordersArr = [];
        $has_more_checkout_sessions = true;
        $checkout_sessions_starting_after_id = null;
        $shipping_rates = $stripe->shippingRates->all([
            'limit' => 2,
        ])->data;
        while ($has_more_checkout_sessions) {
            $params = [
                'limit' => 100,
                'status' => "complete"
            ];
            if ($checkout_sessions_starting_after_id) {
                $params['starting_after'] = $checkout_sessions_starting_after_id;
            }
            $stripe_checkout_sessions = $stripe->checkout->sessions->all($params);
            foreach ($stripe_checkout_sessions as $stripe_checkout_session_data) {
                foreach ($orders as $order) {
                    if ($order->stripe_session_id === $stripe_checkout_session_data->id) {
                        $createdAt = $order->created_at;
                        $formattedTime = $createdAt->format('g:i a');
                        if ($createdAt->isToday()) {
                            $display_time = 'Today at ' . $formattedTime;
                        } elseif ($createdAt->isYesterday()) {
                            $display_time = 'Yesterday at ' . $formattedTime;
                        } else {
                            $weekday = $createdAt->format('l');
                            $display_time = $weekday . ' at ' . $formattedTime;
                        }
                        $calendarDate = $createdAt->format('jS F, Y');
                        $shipping_method = array_values(array_filter($shipping_rates, function ($rate) use ($stripe_checkout_session_data) {
                            if ($rate->id === $stripe_checkout_session_data->shipping_cost->shipping_rate) {
                                return true;
                            }
                        }))[0];
                        $ordersArr[] = [
                            "date" => [
                                "display" => $display_time,
                                "calendar" => $calendarDate
                            ],
                            "id" => $order->id,
                            "customer" => [
                                'email' => $stripe_checkout_session_data->customer_details->email,
                                'name' => $stripe_checkout_session_data->customer_details->name,
                                'phone' => $stripe_checkout_session_data->customer_details->phone
                            ],
                            "payment" => [
                                'total' => $stripe_checkout_session_data->amount_total / 100,
                                'status' => $stripe_checkout_session_data->payment_status,
                            ],
                            "fulfillment" => [
                                'status' => $order->fulfilled,
                                'deliveryMethod' => $shipping_method->display_name
                            ]
                        ];
                    }
                }
            }
            if ($stripe_checkout_sessions->has_more) {
                $checkout_sessions_starting_after_id = $stripe_checkout_sessions->data[99];
            } else {
                $has_more_checkout_sessions = false;
            }
        }
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $ordersArr
        ]);
    })->name('orders');

    Route::get('/dashboard/products', [ProductController::class, 'index'])->name('products');
    Route::get('/dashboard/products/create', [ProductController::class, 'create'])->name('products-create');
    Route::get('/dashboard/products/{product}', [ProductController::class, 'edit'])->name('products-edit');
    Route::post('/dashboard/products', [ProductController::class, 'store'])->name('products-store');
    Route::put('/dashboard/products/{product}', [ProductController::class, 'update'])->name('products-update');
    Route::delete('/dashboard/products/{product}', [ProductController::class, 'destroy'])->name('products-destroy');
});
