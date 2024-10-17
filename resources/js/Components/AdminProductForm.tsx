import React, { FormEvent, forwardRef, useEffect, useRef } from "react";
import TextInput from "./TextInput";
import InputLabel from "./InputLabel";
import Textarea, { TextEditorRef } from "./Textarea";
import ArrayInput from "./ArrayInput";
import ArrayInputField from "./ArrayInputField";
import SecondaryButton from "./SecondaryButton";
import { AdminProductCEUtils } from "@/Utils/utils";
import { AdminProduct, GroupedVariants, ProductArrayKeys, Variant } from "@/types";
import AdminProductVariants from "./AdminProductVariants";

interface Props {
    imagesUrls: string[],
    setImagesUrls: React.Dispatch<React.SetStateAction<string[]>>
    imagesFiles: File[],
    setImagesFiles: React.Dispatch<React.SetStateAction<File[]>>,
    productValues: AdminProduct,
    setProductValues: React.Dispatch<React.SetStateAction<AdminProduct>>,
    activeVariantGroup: number,
    setActiveVariantGroup: React.Dispatch<React.SetStateAction<number>>,
    checkedVariants: number[],
    setCheckedVariants: React.Dispatch<React.SetStateAction<number[]>>
    handleSubmit: (e: React.FormEvent<any>) => void,
    unlimitedQuantity: boolean,
    setUnlimitedQuantity: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminProductForm = forwardRef<TextEditorRef, Props>(
    (
        {
            imagesUrls,
            setImagesUrls,
            imagesFiles,
            setImagesFiles,
            productValues,
            setProductValues,
            unlimitedQuantity,
            setUnlimitedQuantity,
            checkedVariants,
            setCheckedVariants,
            handleSubmit,
            activeVariantGroup,
            setActiveVariantGroup,
        }: Props,
        ref 
    ) => {
    const imagesInputRef = useRef<HTMLInputElement>(null);
    const beltLengthInputRef = useRef<HTMLInputElement>(null);
    const lengthInputRef = useRef<HTMLInputElement>(null);
    const sizeInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<TextEditorRef>(null);
    useEffect(() => {
        if (beltLengthInputRef.current && lengthInputRef.current && sizeInputRef.current) {
            const { listener: beltLengthListener } = AdminProductCEUtils.addSpaceListener({ el: beltLengthInputRef.current, onBlur: false, setProductValues });
            const { listener: lengthInputListener } = AdminProductCEUtils.addSpaceListener({ el: lengthInputRef.current, onBlur: false, setProductValues });
            const { listener: sizeInputListener } = AdminProductCEUtils.addSpaceListener({ el: sizeInputRef.current, onBlur: false, setProductValues });
            return () => {
                if (beltLengthInputRef.current && lengthInputRef.current && sizeInputRef.current) {
                    beltLengthInputRef.current.removeEventListener('keydown', beltLengthListener);
                    lengthInputRef.current.removeEventListener('keydown', lengthInputListener);
                    sizeInputRef.current.removeEventListener('keydown', sizeInputListener);
                }
            }
        }
    }, [beltLengthInputRef.current, lengthInputRef.current, sizeInputRef.current]);

    const handleRemoveImage = (e: React.FormEvent<any>, index: number) => {
        AdminProductCEUtils.handleRemoveImage({
            e,
            index,
            imagesUrls,
            imagesFiles,
            setImagesFiles,
            setImagesUrls
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        AdminProductCEUtils.handleFileChange({
            e,
            setImagesFiles,
            imagesFiles,
            setImagesUrls
        });
    };

    function handleChange(e: React.ChangeEvent<any>) {
        AdminProductCEUtils.handleChange({ e, setProductValues });
    }

    useEffect(() => {
        AdminProductCEUtils.generateAndUpdateBeltLengthAndLengthVariants(
            {
                productValues: productValues,
                unlimitedQuantity: unlimitedQuantity,
                setProductValues: setProductValues
            })
    }, [productValues.belt_lengths, productValues.lengths]);

    useEffect(() => {
        AdminProductCEUtils.generateAndUpdateSizeVariants(
            {
                productValues: productValues,
                unlimitedQuantity: unlimitedQuantity,
                setProductValues: setProductValues
            })
    }, [productValues.sizes]);

    useEffect(() => {
        AdminProductCEUtils.updateProductVariantQuantities(
            {
                productValues: productValues,
                unlimitedQuantity: unlimitedQuantity,
                checkedVariants: checkedVariants,
                setProductValues: setProductValues,
            }
        )
        setProductValues(values => ({
            ...values,
            quantity: unlimitedQuantity ? -1 : 1
        }))

    }, [unlimitedQuantity,checkedVariants]);


    const setVariantQuantity = (value: number, id: number) => {
        if (isNaN(value)) {
            value = 0;
        }
        let productVariantsArr = productValues.product_variants.map(v => v);
        const productVariantToUpdate = productVariantsArr.filter(v => v.id === id);
        productVariantToUpdate[0].quantity = value;
        productVariantToUpdate[0].modified = true;
        productVariantsArr = productVariantsArr.map(v => {
            if (v.id === id) {
                return productVariantToUpdate[0];
            }
            else {
                return v;
            }
        })
        setProductValues(values => ({
            ...values,
            product_variants: productVariantsArr
        }))
    }

    const removeArrayInputItem = (index: number, key: ProductArrayKeys) => {
        AdminProductCEUtils.removeArrayInputItem({ index, key, setProductValues, productValues });
    };

    const groupedVariants = productValues.product_variants.reduce<GroupedVariants>((acc, variant: Variant) => {
        return AdminProductCEUtils.groupVariants({ acc: acc, variant: variant });
    }, {} as GroupedVariants);

    useEffect(() => {
        const variants = productValues.product_variants.map(v => v);
        variants.forEach((variant, index) => {
            if (variant.quantity !== productValues.quantity && variant.modified !== true) {
                variants[index].quantity = productValues.quantity;
            }
        })
        setProductValues((values) => ({
            ...values,
            product_variants: variants
        }))
    }, [productValues.quantity])

    return (
        <div className="py-12 max-w-7xl mx-auto px-4 lg:px-8">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-y-4">
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput
                        id="name"
                        name="name"
                        type="text"
                        onChange={handleChange}
                        required={true}
                        value={productValues.name}
                    />

                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Textarea
                        id="description"
                        ref={ref}
                        value={productValues.description}
                    />

                    <InputLabel htmlFor="quantity">Quantity</InputLabel>
                    <TextInput
                        id="quantity"
                        name="quantity"
                        type="number"
                        onChange={handleChange}
                        required={true}
                        value={productValues.quantity}
                    />
                    <InputLabel htmlFor="beltLength">Belt Length - cm</InputLabel>
                    <ArrayInput
                        id="beltLength"
                        name="beltLength"
                        onBlur={() => AdminProductCEUtils.addSpaceListener({ el: beltLengthInputRef.current!, onBlur: true, setProductValues })}
                        type="number"
                        disabled={productValues.sizes.length > 0 ? true : false}
                        onChange={handleChange}
                        ref={beltLengthInputRef}
                        value={productValues.beltLength}
                    >
                        {productValues.belt_lengths.length > 0 ? productValues.belt_lengths.map((v, i) => (
                            <ArrayInputField field={v} key={`${v} ${i}`} onClick={() => { removeArrayInputItem(i, 'belt_lengths') }} />
                        )) : null}
                    </ArrayInput>
                    <InputLabel htmlFor="length">Length - cm</InputLabel>
                    <ArrayInput
                        id="length"
                        name="length"
                        onBlur={() => AdminProductCEUtils.addSpaceListener({ el: lengthInputRef.current!, onBlur: true, setProductValues })}
                        type="number"
                        disabled={productValues.sizes.length > 0 ? true : false}
                        onChange={handleChange}
                        ref={lengthInputRef}
                        value={productValues.length}
                    >
                        {productValues.lengths.length > 0 ? productValues.lengths.map((v, i) => (
                            <ArrayInputField field={v} key={`${v} ${i}`} onClick={() => { removeArrayInputItem(i, 'lengths') }} />
                        )) : null}
                    </ArrayInput>
                    <InputLabel htmlFor="size">Size</InputLabel>
                    <ArrayInput
                        id="size"
                        name="size"
                        onBlur={() => AdminProductCEUtils.addSpaceListener({ el: sizeInputRef.current!, onBlur: true, setProductValues })}
                        type="text"
                        disabled={productValues.belt_lengths.length > 0 || productValues.lengths.length > 0 ? true : false}
                        ref={sizeInputRef}
                        onChange={handleChange}
                        value={productValues.size}
                    >
                        {productValues.sizes.length > 0 ? productValues.sizes.map((v, i) => (
                            <ArrayInputField field={v} key={`${v} ${i}`} onClick={() => { removeArrayInputItem(i, 'sizes') }} />
                        )) : null}
                    </ArrayInput>
                    <InputLabel htmlFor="price">Price</InputLabel>
                    <TextInput
                        id="price"
                        name="price"
                        type="number"
                        required={true}
                        onChange={handleChange}
                        value={productValues.price}
                    />

                    <InputLabel htmlFor="images">Images</InputLabel>
                    <SecondaryButton
                        className="min-h-12"
                        onClick={(e: React.FormEvent<any>) => {
                            e.preventDefault();
                            imagesInputRef.current?.click();
                        }}>Choose Images
                    </SecondaryButton>
                    <TextInput
                        ref={imagesInputRef}
                        id="images"
                        name="images"
                        type="file"
                        multiple={true}
                        accept="image/*"
                        className="hidden"
                        required={false}
                        onChange={handleFileChange}
                    />

                    {imagesUrls.length > 0 && (
                        <div>
                            <p className="my-4 text-gray-500 text-sm">Image Previews</p>
                            <div className="border-gray-300 flex items-start gap-10 max-lg:justify-between flex-wrap rounded">
                                {imagesUrls.map((preview, index) => (
                                    <div className="min-w-36 max-w-[calc(33.3%-2.5rem)] lg:max-w-72 h-auto border-gray-300 border rounded-md p-4 shadow-sm flex flex-col items-center gap-4" key={`${preview} ${index}`}>
                                        <SecondaryButton
                                            onClick={(e) => { handleRemoveImage(e, index) }}
                                            className="place-self-end">
                                            Remove
                                        </SecondaryButton>
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Selected Image ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {productValues.product_variants.length > 0 ?
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Variants</h3>
                            <div className="flex flex-row-reverse items-center gap-4">
                                <InputLabel htmlFor="checkedVariants">
                                    {checkedVariants.length > 0 ? "Mark selected as unlimited" : "Mark all as unlimited"}
                                </InputLabel>
                                <TextInput
                                    type="checkbox"
                                    id="checkedVariants"
                                    checked={unlimitedQuantity}
                                    name="checkedVariants"
                                    className="cursor-pointer"
                                    onChange={(e) => setUnlimitedQuantity(e.target.checked)}
                                />
                            </div>
                        </div>
                        <AdminProductVariants
                            productValues={productValues}
                            groupedVariants={groupedVariants}
                            activeVariantGroup={activeVariantGroup}
                            checkedVariants={checkedVariants}
                            setVariantQuantity={setVariantQuantity}
                            setCheckedVariants={setCheckedVariants}
                            setActiveVariantGroup={setActiveVariantGroup}
                        />
                    </div> : null}
                    <SecondaryButton className="h-12 max-w-32 justify-center">Create</SecondaryButton>
                </div>
            </form>
        </div>
    )
});

export default AdminProductForm;