import { WEBSITE_URL } from "@/Constants/Consts";
import { ClientCart } from "@/types";
import { getCookie } from "@/Utils/utils";

interface CartProps {
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    setCartData: React.Dispatch<React.SetStateAction<ClientCart>>,
    setError?: React.Dispatch<React.SetStateAction<string>>,
    setInputQuantity?: React.Dispatch<React.SetStateAction<number>>
    cart: ClientCart,
    cartItemsId: number,
    variantId: number,
    inputQuantity: number
}


export const CartFetchFacade = {
    updateItemQuantity: async ({
        setIsProcessing,
        setCartData,
        setError,
        setInputQuantity,
        cart,
        cartItemsId,
        variantId,
        inputQuantity,

    }: CartProps) => {
        const XSRF_TOKEN = getCookie('XSRF-TOKEN');
        const updatedQuantity = inputQuantity;
        setIsProcessing(true);
        await fetch(`http://127.0.0.1:8000/cart/${cartItemsId}/${variantId}`, {
            method: "PUT",
            body: JSON.stringify({
                quantity: updatedQuantity
            }),
            headers: {
                'X-XSRF-Token': XSRF_TOKEN,
                'Content-Type': 'application/json'
            },
        })
            .then(async res => {
                setIsProcessing(false);
                if (res.status === 200) {
                    const updatedCartItems = cart.items.map((item) => {
                        if (item.variant_id === variantId) {
                            return {
                                ...item,
                                quantity: updatedQuantity
                            }
                        }
                        else {
                            return item;
                        }
                    });
                    setCartData(values => ({
                        ...values,
                        items: updatedCartItems
                    }))
                }
                else if (res.status === 204) {
                    const updatedCartItems = cart.items.filter(item => item.variant_id !== variantId);
                    setCartData(values => ({
                        ...values,
                        items: updatedCartItems
                    }))
                }
                else if (res.status === 400) {
                    const data = await res.json();
                    const error = new Error(data.error);
                    if (error.message === "The requested quantity exceeds available quantity") {
                        cart.items.forEach((item) => {
                            if (item.variant_id === variantId) {
                                if (item.belt_length && item.length) {
                                    setError!(`Nie możesz dodać więcej ${item.name} - ${item.belt_length} / ${item.length} do koszyka.`);
                                }
                                else if (item.size) {
                                    setError!(`Nie możesz dodać więcej ${item.name} - ${item.size} do koszyka.`);
                                }
                                setInputQuantity!(item.quantity);
                            }
                        })
                    }
                }
            })
    },
    deleteItemFromCart: async ({
        setIsProcessing,
        setCartData,
        cart,
        cartItemsId,
        variantId
    }: CartProps) => {
        const XSRF_TOKEN = getCookie('XSRF-TOKEN');
        setIsProcessing(true);
        await fetch(`${WEBSITE_URL}cart/${cartItemsId}/${variantId}`, {
            method: "DELETE",
            headers: {
                'X-XSRF-Token': XSRF_TOKEN
            },
        }).then((res) => {
            if (res.status === 204) {
                setIsProcessing(false);
                const updatedCartItems = cart.items.filter(item => item.variant_id !== variantId);
                setCartData(values => ({
                    ...values,
                    items: updatedCartItems
                }))
            }
        })
    }
}