
import { CDN_URL } from "@/Constants/Consts";
import React, { useState } from "react";
import Loader from "./Loader";

interface Props {
    name: string,
    path: string
}

export default function CartItemImage({ path, name }: Props) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <>
            {!isLoaded ? <Loader parentClass="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : null}
            <img
                src={`${CDN_URL}300xAUTO${path}`}
                alt={name}
                onLoad={() => setIsLoaded(true)}
                width="150"
                height="226"
                className="cart-item__image border border-gray min-w-[100px]"
                loading="lazy"
            />
        </>
    )
}