import AdminProductForm from "@/Components/AdminProductForm";
import { TextEditorRef } from "@/Components/Textarea";
import AppLayout from "@/Layouts/AppLayout";
import { AdminProduct, Variant } from "@/types";
import { router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

interface ProductValues {
    product: AdminProduct,
    images: string[],
    variants: Variant[]
}

export default function Edit({ product, images,variants }: ProductValues) {
    const [imagesUrls, setImagesUrls] = useState<string[]>(images);
    const [imagesFiles, setImagesFiles] = useState<File[]>([]);
    const [activeVariantGroup, setActiveVariantGroup] = useState<number>(0);
    const [checkedVariants, setCheckedVariants] = useState<number[]>([]);
    const [unlimitedQuantity, setUnlimitedQuantity] = useState<boolean>(false);
    const textareaRef = useRef<TextEditorRef>(null);
    const [productValues, setProductValues] = useState<AdminProduct>({
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        lengths: product.lengths ? (product.lengths.length > 0 ? product.lengths : []) : [],
        sizes: product.sizes ? (product.sizes.length > 0 ? product.sizes : []) : [],
        belt_lengths: product.belt_lengths ? (product.belt_lengths.length > 0 ? product.belt_lengths : []) : [],
        length: "",
        size: "",
        beltLength: "",
        product_variants:variants
    });
    useEffect(() => {
        async function getImagesFiles() {
            const filesArr = [];
            for (let i = 0; i < imagesUrls.length; i++) {
                const filename = imagesUrls[i].slice(imagesUrls[i].lastIndexOf('/') + 1);
                const file = await urlToFile(imagesUrls[i], filename);
                filesArr.push(file);
            }
            setImagesFiles(filesArr);
        }
        getImagesFiles();
    }, []);
    async function urlToFile(url: string, filename: string, mimeType = 'image/jpeg') {
        const response = await fetch(url, {
            mode: 'cors',
            cache:'no-cache'
        });
        const blob = await response.blob();
        const file = new File([blob], filename, { type: mimeType });
        return file;
    }

    function handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault();
        if (textareaRef.current) {
            const submitData = {
                ...productValues,
                description: textareaRef.current.getContent()
            }
            router.post(`/dashboard/products/${product.id}`, {
                ...submitData,
                images: imagesFiles,
                _method: 'put'
            });
        }
    }
    return (
        <AppLayout
            title="Dashboard"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Edit A Product
                </h2>
            )}
        >
            <AdminProductForm
                imagesUrls={imagesUrls}
                setImagesUrls={setImagesUrls}
                imagesFiles={imagesFiles}
                setImagesFiles={setImagesFiles}
                productValues={productValues}
                setProductValues={setProductValues}
                unlimitedQuantity={unlimitedQuantity}
                setUnlimitedQuantity={setUnlimitedQuantity}
                checkedVariants={checkedVariants}
                setCheckedVariants={setCheckedVariants}
                handleSubmit={handleSubmit}
                activeVariantGroup={activeVariantGroup}
                ref={textareaRef}
                setActiveVariantGroup={setActiveVariantGroup}
            />
        </AppLayout>
    );
}
