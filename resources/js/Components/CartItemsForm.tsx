import { ClientCart } from "@/types";
import React, { useContext } from "react";
import { PropsContext } from "@/Context/PropsContext";
import CartItem from "./CartItem";

export default function CartItemsForm() {
    const { cartData } = useContext(PropsContext);
    const { cart: cart } = cartData as { cart: ClientCart };
    return (
        <form>
            <div className="
                cart__items
                border-b border-gray
            ">
                <table className="cart-items">
                    <thead>
                        <tr className="caption-with-letter-spacing text-gray-750">
                            <th colSpan={2}>Produkt</th>
                            <th colSpan={1} className="min-[750px]:hidden">Suma</th>
                            <th colSpan={1} className="max-tablet:hidden cart-items__heading--quantity">Ilość</th>
                            <th colSpan={1} className="max-tablet:hidden right">Suma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.items.map((item, i) => (
                            <CartItem item={item} key={`${item} ${i}`}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </form>
    );
}
