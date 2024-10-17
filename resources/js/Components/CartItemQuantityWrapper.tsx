import React, { useContext, useEffect, useRef, useState } from "react";
import QuantityInput from "./QuantityInput";
import { getCookie } from "@/Utils/utils";
import { WEBSITE_URL } from "@/Constants/Consts";
import { debounce } from "lodash";
import { PropsContext } from "@/Context/PropsContext";
import { ClientCart } from "@/types";
import { CartFetchFacade } from "@/Lib/Fetch";
import errorIcon from '../../assets/error.svg';

interface Props {
    cartItemsId: number,
    variantId: number,
    quantity: number,
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CartItemQuantityWrapper({ cartItemsId, variantId, quantity, setIsProcessing }: Props) {
    const { cartData } = useContext(PropsContext)
    const { setCartData, cart } = cartData as {
        setCartData: React.Dispatch<React.SetStateAction<ClientCart>>,
        cart: ClientCart
    };
    const [inputQuantity, setInputQuantity] = useState<number>(quantity);
    const isInitialRender = useRef(true);
    const debounceTimeout = useRef<number | undefined>(undefined);
    const [error, setError] = useState<string>("");

    const deleteItemFromCart = async () => {
        await CartFetchFacade.deleteItemFromCart({
            setIsProcessing: setIsProcessing,
            setCartData: setCartData,
            cart: cart,
            cartItemsId: cartItemsId,
            variantId: variantId,
            inputQuantity: inputQuantity
        });
    }

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = window.setTimeout(async () => {
            await CartFetchFacade.updateItemQuantity({
                setIsProcessing: setIsProcessing,
                setCartData: setCartData,
                setError: setError,
                setInputQuantity: setInputQuantity,
                cart: cart,
                cartItemsId: cartItemsId,
                variantId: variantId,
                inputQuantity: inputQuantity
            })
        }, 500);

        return () => clearTimeout(debounceTimeout.current);
    }, [inputQuantity]);

    const updateQuantity = (e: React.FormEvent<any>, action: string | boolean) => {
        e.preventDefault();
        if (action === "add") {
            setInputQuantity(prev => prev + 1);
        }
        if (action === "substract") {
            setInputQuantity(prev => prev - 1);
        }
        if (action === false && e.target instanceof HTMLInputElement) {
            const inputValue = parseInt(e.target.value, 10);
            if (!isNaN(inputValue)) {
                setInputQuantity(inputValue);
            } else {
                setInputQuantity(0);
            }
        }
    };

    return (
        <td className="cart-item__quantity">
            <div className="cart-item__quantity-wrapper quantity-popover-wrapper">
                <div className="quantity-popover-container flex flex-col">
                    <QuantityInput quantity={inputQuantity} threshold={0} changeQuantity={updateQuantity}>
                        <div className="cart-remove-button button items-center cursor-pointer" onClick={() => {
                            deleteItemFromCart();
                        }}>

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="icon icon-remove">
                                <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                                <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
                            </svg>

                        </div>
                    </QuantityInput>
                    {error.length > 0 ?
                        <div className="text-xs mt-4 text-gray-750 text-left items-start flex gap-4">
                            <img src={errorIcon} alt="error" width="15px" height="15px" />
                            {error}
                        </div> : null}
                </div>

            </div>
        </td>
    )
}