import CartItemsForm from "@/Components/CartItemsForm";
import { PropsContext } from "@/Context/PropsContext";
import ClientLayout from "@/Layouts/ClientLayout";
import { ClientCart } from "@/types";
import { formatNumber, getCookie } from "@/Utils/utils";
import { Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

interface Props {
    cart?: ClientCart | null
}

export default function Cart({ cart }: Props) {
    const [cartData,setCartData] = useState<ClientCart | null>(cart || null);
    const [totalCartItemsQuantity,setTotalCartItemsQuantity] = useState<number>(0);
    const [totalCartItemsPrice,setTotalCartItemsPrice] = useState<number>(0);
    useEffect(() => {
        if (cartData) {
            let totalCartItemsCount = 0;
            let totalPrice = 0;
            for (const item of cartData.items) {
                totalCartItemsCount+= item.quantity;
                totalPrice+= parseFloat(item.price) * item.quantity;
            }
            setTotalCartItemsPrice(totalPrice);
            setTotalCartItemsQuantity(totalCartItemsCount);
        }
    },[cartData]);
    const proceedToCheckout = async () => {
        if (cartData) {
            const cartItems = cartData.items.map((i) => {
                return {
                    quantity:i.quantity,
                    variantId:i.variant_id
                }
            })
            const XSRF_TOKEN = getCookie("XSRF-TOKEN");
            await fetch('http://127.0.0.1:8000/checkout',{
                body: JSON.stringify({
                    items: cartItems
                }),
                method: "POST",
                headers: {
                    "X-XSRF-Token": XSRF_TOKEN,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(data => {
                window.location.href = data.url;
            })
        }
    };
    return (
        <PropsContext.Provider value={{
            cartData: {
                setCartData:setCartData,
                cart:cartData
            },
            DBCart: {
                value: {
                    itemsCount: totalCartItemsQuantity
                }
            }
        }}>
        <ClientLayout
            title="Twój koszyk"
        >
            {cartData && cartData.items.length > 0 ?
                <div className=" py-[27px]
                    tablet:py-[36px]">
                    <div className="
                    page-width
                ">
                        <div className="
                        flex
                        justify-between
                        items-end
                        mb-[30px]
                        flex-wrap
                        w-full
                        gap-4
                    ">
                            <h1 className="text-3xl tablet:text-4xl">Twój koszyk</h1>
                            <Link href="/" className="mt-0 text-sm underline underline-offset-[0.3rem] hover:decoration-2 text-gray-850">Kontynuuj zakupy</Link>
                        </div>
                        <CartItemsForm/>
                        <div className="pb-[50px] flex max-tablet:flex-col tablet:justify-between pt-[40px]">
                             <div className="w-full flex flex-col tablet:max-w-[350px]">
                                <label className="text-[1rem] text-gray-750 pb-4">Specjalne instrukcje do zamówienia</label>
                                <textarea className="py-[10px] px-[20px] mx-[1px] my-[1px] min-h-[100px]"></textarea>
                             </div>
                             <div className="w-full max-tablet:mt-[30px] tablet:ml-[40px] max-tablet:flex max-tablet:flex-col text-center max-tablet:justify-center tablet:max-w-[350px]">
                                <div className="flex items-end justify-center tablet:justify-end">
                                    <p className="text-[1rem]">Przewidywana Suma</p>
                                    <p className="text-[1.1rem] ml-[20px] text-gray-750">{formatNumber(totalCartItemsPrice)} zł PLN</p>
                                </div>
                                <p className="text-[0.8rem] tablet:text-right my-[22px] text-gray-750">
                                Podatek wliczony w cenę, koszty wysyłki i rabaty są obliczane przy realizacji zakupu
                                </p>
                                <button className="primary-btn relative w-full max-w-[360px] max-tablet:mx-auto bg-black text-white h-[45px] text-[0.6em]" onClick={proceedToCheckout}>Realizuj Zakup</button>
                             </div>
                        </div>
                    </div></div> :
                <div className="page-width text-center">
                    <h1 className="max-tablet:text-2xl text-4xl pt-[4.5rem] pb-8">Twój koszyk jest pusty</h1>
                    <Link href="/">
                        <button className="cart-btn primary-btn mx-auto empty-cart-btn relative bg-black text-white">Kontynuuj Zakupy</button>
                    </Link>
                </div>

            }
        </ClientLayout>
        </PropsContext.Provider>
    )
}