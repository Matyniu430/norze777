<?php

function getSingleProductOutputData($cart_item, $product)
{
    $items = [];
    $allItemsQuantity = 0;
    foreach ($cart_item->items as $item) {
        if ($item['product_id'] === $product->id) {
            $items[] = [
                "quantity" => $item['quantity'],
                "variant_id" => $item['variant_id']
            ];
        }
        $allItemsQuantity += $item['quantity'];
    }
    return [
        "items" => $items,
        "allItemsQuantity" => $allItemsQuantity
    ];
}

?>
