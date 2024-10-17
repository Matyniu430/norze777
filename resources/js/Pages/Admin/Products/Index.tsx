import AdminProduct from "@/Components/AdminProduct";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import React, { useRef } from 'react';

type Product = {
    name: string,
    price: number,
    description: string,
    quantity: number,
    id: number,
}

export default function Products({ products, images }: { products: Product[], images: string[] }) {
    const createLinkRef = useRef<HTMLAnchorElement>(null);
    return (
        <AppLayout
            title="Dashboard"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Products
                </h2>
            )}
        >
            <div className="py-12 px-3 lg:px-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-y-6">
                    <SecondaryButton onClick={() => createLinkRef.current?.click()} className="place-self-end">
                        <Link ref={createLinkRef} href="/dashboard/products/create">Create</Link>
                    </SecondaryButton>
                    {products.map((p, i) => {
                        for (let id in images) {
                            if (id === p.id.toString()) {
                                return (
                                    <AdminProduct
                                        product={p}
                                        image={images[id]}
                                        key={`${p} ${id}`}
                                    />
                                )
                            }
                        }
                    })}
                </div>
            </div>
        </AppLayout>
    )
}