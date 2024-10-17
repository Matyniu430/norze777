import { HomeProps } from "@/types";
import React from "react";
import HomeProductCard from "./HomeProductCard";

export default function HomeProductsSlider({ products, images }: HomeProps) {
    return (
        <div className={`
            page-width 
            home-products-slider 
            px-[1.5rem]
            flex
            flex-wrap
            gap-x-[4px]
            gap-y-[4px]
            tablet:px-[5rem]
            tablet:gap-y-[8px]
            justify-between
            tablet:gap-x-[8px]
        `
        }>
            {products.toReversed().map((product) => {
                for (const imgKey in images) {
                    if (imgKey === product.id.toString()) {
                        return (
                            <HomeProductCard
                                key={`${product.name}`}
                                product={product}
                                imageUrls={images[imgKey]}
                            />
                        )
                    }
                }
            })}
        </div>
    )
}