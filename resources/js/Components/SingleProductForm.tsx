import { DBSingleProductCart, ProcessingData, SingleProductT, Variant } from "@/types";
import { useForm } from "@inertiajs/react";
import React, { useContext, useEffect, useState } from "react";
import SingleProductOptionSelectWithContext from "./SingleProductOptionSelectWithContext";
import { PropsContext } from "@/Context/PropsContext";
import { getCookie } from "@/Utils/utils";
import Loader from "./Loader";
import SingleProductQuantityErr from "./SingleProductQuantityErr";
import QuantityInput from "./QuantityInput";

export default function SingleProductForm({ product, variants }: { product: SingleProductT, variants: Variant[] }) {
    const { data, setData } = useForm({
        id: product.id,
        beltLength: product.belt_lengths ? product.belt_lengths[0] : null,
        length: product.lengths ? product.lengths[0] : null,
        size: product.sizes ? product.sizes[0] : null,
        quantity: 1,
    })

    const [selectedVariant, setSelectedVariant] = useState<Variant>();
    const context = useContext(PropsContext);
    useEffect(() => {
        const {selectedVariant:sVariant} = context as {selectedVariant:Variant};
        if (sVariant) {
            setData(values => ({
                ...values,
                beltLength: sVariant.belt_length!,
                length: sVariant.length!,
                size: sVariant.size!
            }))
            setSelectedVariant(sVariant);
        }
    },[])
    const { cart, DBCart} = context
    const { processingData } = context as { processingData: ProcessingData };
    const { setClientCart } = cart;
    const { value: DBCartValue, setDBCart } = DBCart as { 
        value: DBSingleProductCart, 
        setDBCart: React.Dispatch<React.SetStateAction<DBSingleProductCart>> 
    };

    var canAddToCart;

    if (selectedVariant) {
        let currentVariantCartQuantity = 0;
        for (let i = 0;i<DBCartValue.items.length;i++) {
            if (selectedVariant.id === DBCartValue.items[i].variant_id) {
                currentVariantCartQuantity+= DBCartValue.items[i].quantity;
            }
        }
        canAddToCart = selectedVariant.quantity === 0 || ((selectedVariant.quantity < data.quantity
            || selectedVariant.quantity < data.quantity
            || currentVariantCartQuantity + data.quantity > selectedVariant.quantity)
            && selectedVariant.quantity !== -1)
    }

    const setOption = (option: string, property: string) => {
        setData({
            ...data,
            [property]: option
        })
    }

    const changeQuantity = (e: React.FormEvent<HTMLInputElement | HTMLButtonElement>, action: string | boolean) => {
        e.preventDefault();
        let quantityCopy = data.quantity;
        if (action) {
            action === "substract" ? quantityCopy -= 1 : quantityCopy += 1;
        }
        else {
            quantityCopy = Number((e.target as HTMLInputElement).value);
        }
        setData({
            ...data,
            quantity: quantityCopy
        })
    }

    useEffect(() => {
        if (data.beltLength && data.length) {
            for (let i = 0; i < variants.length; i++) {
                if (data.beltLength === variants[i].belt_length && data.length === variants[i].length) {
                    setSelectedVariant(variants[i]);
                    break;
                }
            }
        }
    }, [data.beltLength, data.length]);

    useEffect(() => {
        if (data.size) {
            for (let i = 0; i < variants.length; i++) {
                if (data.size === variants[i].size) {
                    setSelectedVariant(variants[i]);
                }
            }
        }
    }, [data.size]);

    const addToCart = async (e: React.FormEvent<any>) => {
        e.preventDefault();
        const selectedVariantToCart = selectedVariant;
        const XSRF_TOKEN = getCookie('XSRF-TOKEN');
        processingData.setIsProcessing(true);
        await fetch(`http://127.0.0.1:8000/cart/${data.id}/${selectedVariant?.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': XSRF_TOKEN
            },
            body: JSON.stringify({ quantity: data.quantity })
        })
            .then(async res => {
                if (res.status === 200) {
                    const fetchData = await res.json();
                    setClientCart({
                        name: product.name,
                        belt_length: selectedVariantToCart?.belt_length,
                        length: selectedVariantToCart?.length,
                        size: selectedVariantToCart?.size
                    });
                    setDBCart({
                        items: fetchData.items,
                        itemsCount: fetchData.itemsCount
                    })
                    processingData.setIsProcessing(false);
                }
            });
    }

    return (
        <>
            <form className="mb-[1.5rem]">
                {product.belt_lengths ?
                    <SingleProductOptionSelectWithContext
                        value={{
                            options: product.belt_lengths,
                            legend: 'Pas',
                            property: "beltLength",
                            setter: setOption,
                            currentOption: data.beltLength as string,
                        }}
                    /> : null}
                {product.lengths ?
                    <SingleProductOptionSelectWithContext
                        value={{
                            options: product.lengths,
                            legend: 'Długość',
                            property: "length",
                            setter: setOption,
                            currentOption: data.length as string,
                        }}
                    /> : null
                }
                {product.sizes ?
                    <SingleProductOptionSelectWithContext
                        value={{
                            options: product.sizes,
                            legend: 'Rozmiar',
                            property: "size",
                            setter: setOption,
                            currentOption: data.size as string,
                        }}
                    /> : null}
                <label className="max-w-[140px] inline-block" onClick={(e) => e.preventDefault()}>
                    <p className="text-sm mb-[0.6rem] text-gray-750">Ilość</p>
                    <QuantityInput changeQuantity={changeQuantity} quantity={data.quantity} />
                </label>
                {selectedVariant && <>
                    {canAddToCart ?
                        <SingleProductQuantityErr
                            text={`Nie możesz dodać więcej ${product.name} - 
                                ${selectedVariant.belt_length ? `${selectedVariant.belt_length} / ${selectedVariant.length}` : `${selectedVariant.size}`} do koszyka.`
                            }
                        /> : null
                    }
                    <div className="
                            max-w-[440px]
                            mt-5
                        ">
                        <button className={`cart-btn ${selectedVariant.quantity === 0 || selectedVariant.quantity < data.quantity ? "cursor-not-allowed" : ""}`}
                            onClick={(e) => addToCart(e)}
                            disabled={canAddToCart ? true : false}
                        >
                            {processingData.isProcessing ? <Loader /> :
                                <span>Dodaj Do Koszyka</span>
                            }
                        </button>
                    </div>
                </>}
            </form>
        </>
    )
}