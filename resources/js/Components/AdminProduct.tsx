import React, { useRef, useState } from "react"
import AdminCardField from "./AdminCardField"
import SecondaryButton from "./SecondaryButton"
import { useWindowSize } from "@uidotdev/usehooks"
import { Link, router } from "@inertiajs/react"
import { getUrlPath } from "@/Utils/utils"
import Loader from "./Loader"
import AdminCardContainer from "./AdminCardContainer"

type Product = {
    name: string,
    price: number,
    description: string,
    quantity: number,
    id: number,
}

export default function AdminProduct({ product, image }: { product: Product, image: string }) {
    const size = useWindowSize();
    const width = size?.width || 0;
    const deleteProduct = () => {
        router.delete(`/dashboard/products/${product.id}`);
    }
    const [isLoaded, setIsLoaded] = useState(false);
    const result = getUrlPath(image);
    const editLinkRef = useRef<HTMLAnchorElement>(null);
    return (
        <AdminCardContainer>
            <img src={`http://norze.s3-website.eu-north-1.amazonaws.com/192xAUTO${result.path}`} alt="product preview" className={`${isLoaded ? "max-w-48" : 'max-w-0'}`} onLoad={() => setIsLoaded(true)} />
            {!isLoaded ? <Loader parentClass="my-auto" className="max-w-[1.3rem]" /> : null}
            <div className=" flex items-center max-[1090px]:w-full flex-wrap gap-x-2 gap-y-8 my-8 justify-between text-sm max-sm:flex-wrap">
                <AdminCardField
                    fieldName="Name"
                    content={product.name}
                />
                <AdminCardField
                    fieldName="Price"
                    last={width < 640 ? true : false}
                    content={product.price}
                />
                <AdminCardField
                    fieldName="Description"
                    content={product.description}
                />
                <AdminCardField
                    last={width < 895 ? true : false}
                    fieldName="Quantity"
                    content={product.quantity}
                />
                <div className={`${width < 895 ? 'w-full' : ''} flex gap-3 justify-end`}>
                    <SecondaryButton onClick={() => editLinkRef.current?.click()}>
                        <Link ref={editLinkRef} href={`/dashboard/products/${product.id}`}>Edit</Link>
                    </SecondaryButton>
                    <SecondaryButton
                        onClick={deleteProduct}
                    >
                        Delete
                    </SecondaryButton>
                </div>
            </div>
        </AdminCardContainer>
    )
}