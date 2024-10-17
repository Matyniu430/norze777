import { Link } from "@inertiajs/react";
import CartItemImage from "./CartItemImage";
import CartItemQuantityWrapper from "./CartItemQuantityWrapper";
import Loader from "./Loader";
import { ClientCartItem } from "@/types";
import { WEBSITE_URL } from "@/Constants/Consts";
import { useState } from "react";
import { formatNumber, getUrlPath } from "@/Utils/utils";
import React from "react";
import CartItemPrice from "./CartItemPrice";

interface Props {
    item: ClientCartItem
}

export default function CartItem({ item }: Props) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    return (
        <tr className="cart-item">
            <td className="cart-item__media relative">
                <div className="cart-item__image-container relative overflow-visible bg-white">
                    <CartItemImage path={getUrlPath(item.previewImageUrl).path} name={item.name} />
                </div>
            </td>
            <td className="cart-item__details">
                <Link href={`${WEBSITE_URL}products/${item.name}?variantId=${item.variant_id}`} className="cart-item__name hover:underline hover:decoration-2">{item.name}</Link>
                <div className="product-option text-gray-750">
                    {formatNumber(parseFloat(item.price))} zł
                </div>
                <dl>
                    {item.belt_length ?
                        <>
                            <div className="product-option text-gray-750">
                                <dt>pas: </dt>
                                <dd>{item.belt_length} cm</dd>
                            </div>
                            <div className="product-option text-gray-750">
                                <dt>długość: </dt>
                                <dd>{item.length} cm</dd>
                            </div>
                        </> :
                        <div className="product-option text-gray-750">
                            <dt>rozmiar: </dt>
                            <dd>{item.size}</dd>
                        </div>
                    }
                </dl>
            </td>
            <td className="right cart-item__totals hidden max-tablet:flex">
                {isProcessing ? <Loader /> :
                    <CartItemPrice price={item.price} quantity={item.quantity} />
                }
            </td>
            <CartItemQuantityWrapper
                key={item.variant_id}
                cartItemsId={item.cart_items_id}
                setIsProcessing={setIsProcessing}
                variantId={item.variant_id}
                quantity={item.quantity} />
            <td className="right cart-item__totals flex justify-end mt-2 max-tablet:small-hide">
                {isProcessing ? <Loader /> :
                    <CartItemPrice price={item.price} quantity={item.quantity} />
                }
            </td>
        </tr>
    )
}