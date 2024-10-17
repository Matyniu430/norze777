import { formatNumber } from "@/Utils/utils";
import React from "react";

interface Props {
    price:string,
    quantity:number,
}

export default function CartItemPrice({price,quantity}: Props) {
    return (
        <div className="cart-item__price-wrapper">
            <span className="price">{formatNumber(parseFloat(price) * quantity)} zł</span>
        </div>
    )
}