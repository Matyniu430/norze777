import React from 'react';
import HomeProductCardImage from './HomeProductCardImage';
import { Link } from '@inertiajs/react';
import { formatNumber } from '@/Utils/utils';

interface Product {
    name: string,
    price: string
}

interface Props {
    product: Product,
    imageUrls: string[]
}

export default function HomeProductCard({ product, imageUrls }: Props) {
    const { name, price } = product;
    return (
        <Link href={`/products/${product.name}`} className='max-w-[calc(50%-2px)]
            group
            tablet:max-w-[calc(50%-4px)]
            desktop:max-w-[calc(33%-4px)]'>
            <div>
                <div className='relative overflow-hidden'>
                    <HomeProductCardImage
                        imageUrl={imageUrls[0]}
                        childClass="duration-700 group-hover:opacity-0"
                        parentClass="duration-700 bg-gray-02 group-hover:bg-transparent ease-[cubic-bezier(.25,.46,.45,.94)]"
                    />
                    {imageUrls[1] && (
                        <HomeProductCardImage
                            imageUrl={imageUrls[1]}
                            parentClass="absolute opacity-0 top-0 group-hover:opacity-100"
                            childClass="duration-700 group-hover:scale-[1.04]"
                        />
                    )}
                </div>
                <div className='
                py-[1.3rem]
                
            '>
                    <p className='text-sm group-hover:underline underline-offset-[0.3rem]'>{name}</p>
                    <p className='text-sm mt-[0.7rem]'>{formatNumber(parseFloat(price))} zł PLN</p>
                </div>
            </div>
        </Link>
    )
}