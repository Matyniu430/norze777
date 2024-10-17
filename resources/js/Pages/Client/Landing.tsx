import HomeProductsSlider from '@/Components/HomeProductsSlider';
import ClientLayout from '@/Layouts/ClientLayout';
import { HomeProps } from '@/types';
import React from 'react';


export default function Landing({ products, images }: HomeProps) {
    return (
        <ClientLayout
            title='Norze777'
        >
            <main>
                <HomeProductsSlider
                    products={products}
                    images={images}
                />
            </main>
        </ClientLayout>
    )
}