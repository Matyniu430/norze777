import SingleProductContainer from "@/Components/SingleProductContainer";
import { PropsContext } from "@/Context/PropsContext";
import ClientLayout from "@/Layouts/ClientLayout";
import { DBSingleProductCart, SingleProductCart, SingleProductT, Variant } from "@/types";
import React, { useState } from "react";


interface Props {
    product: SingleProductT,
    images: string[],
    variants: Variant[],
    selectedVariant: Variant | null,
    cart?: DBSingleProductCart 
}

export default function SingleProduct({ product, images, variants, cart,selectedVariant }: Props) {
    const [clientCart,setClientCart] = useState<SingleProductCart | null>(null);
    const [isProcessing,setIsProcessing] = useState<boolean>(false);
    const [DBCart,setDBCart] = useState<DBSingleProductCart>(cart ? cart : {
        items: [],
        itemsCount: 0
    });

    return (
        <PropsContext.Provider value={{
            cart: {
                value:clientCart,
                setClientCart:setClientCart
            },
            DBCart: {
                value: DBCart,
                setDBCart:setDBCart
            },
            previewImageUrl: images[0],
            processingData : {
                isProcessing:isProcessing,
                setIsProcessing:setIsProcessing
            },
            selectedVariant: selectedVariant,
            hasCart: true
        }}>
            <ClientLayout
                title={`${product.name} - Norze777`}
            >
                <main className='
                pt-[27px]
                pb-[9px]
            '>  
                    <SingleProductContainer
                        variants={variants}
                        product={product}
                        images={images}
                    />
                </main>
            </ClientLayout>
        </PropsContext.Provider>
    )
}