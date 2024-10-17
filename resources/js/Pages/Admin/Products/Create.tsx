import AppLayout from "@/Layouts/AppLayout"
import { AdminProduct } from "@/types"
import { AdminProductCEUtils } from "@/Utils/utils"
import React, { useRef, useState } from "react"
import AdminProductForm from "@/Components/AdminProductForm"
import { TextEditorRef } from "@/Components/Textarea"

export default function Create() {
    const [imagesUrls, setImagesUrls] = useState<string[]>([]);
    const [imagesFiles, setImagesFiles] = useState<File[]>([]);
    const [activeVariantGroup, setActiveVariantGroup] = useState<number>(0);
    const [checkedVariants, setCheckedVariants] = useState<number[]>([]);
    const [unlimitedQuantity, setUnlimitedQuantity] = useState<boolean>(false);
    const textareaRef = useRef<TextEditorRef>(null);
    const [productValues, setProductValues] = useState<AdminProduct>({
        name: "",
        description: "",
        quantity: 1,
        price: 0,
        lengths: [],
        sizes: [],
        belt_lengths: [],
        length: "",
        size: "",
        beltLength: "",
        product_variants: []
    })

    function handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault();
        if (textareaRef.current) {
            const submitData = {
                ...productValues,
                description: textareaRef.current.getContent()
            }
            AdminProductCEUtils.handleSubmit({ e, productValues:submitData, imagesFiles });
        }
    }

    return (
        <AppLayout
            title="Dashboard"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Create A Product
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
    )
}
