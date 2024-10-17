import { AdminProduct, ProductArrayKeys, Variant } from "@/types";
import { router } from "@inertiajs/react";
import React, { Dispatch, SetStateAction } from "react";

type ReactProductSetAction = Dispatch<SetStateAction<AdminProduct>>;
type ReactImagesFilesSetAction = Dispatch<SetStateAction<File[]>>;
type ReactImagesUrlsSetAction = Dispatch<SetStateAction<string[]>>;

export function getUrlPath(url: string) {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    return {
        path
    };
}

type RemoveArrayInputItemArgs = {
    index: number;
    key: ProductArrayKeys;
    setProductValues: ReactProductSetAction;
    productValues: AdminProduct;
};

const removeArrayInputItem = ({ index, key, setProductValues, productValues }: RemoveArrayInputItemArgs) => {
    const arr = productValues[key].filter((_, i) => i !== index);
    setProductValues(values => ({
        ...values,
        [key]: arr,
    }));
};

type HandleChangeArgs = {
    e: React.ChangeEvent<any>;
    setProductValues: ReactProductSetAction;
};

function handleChange({ e, setProductValues }: HandleChangeArgs) {
    const key = e.target.id;
    const value = key === 'quantity' ? parseInt(e.target.value) : e.target.value;
    setProductValues(values => ({
        ...values,
        [key]: value,
    }));
}

type HandleSubmitArgs = {
    e: React.FormEvent<any>;
    productValues: AdminProduct;
    imagesFiles: File[];
};

function handleSubmit({ e, productValues, imagesFiles }: HandleSubmitArgs) {
    e.preventDefault();
    router.post('/dashboard/products', {
        ...productValues,
        images: imagesFiles,
    });
}

type HandleRemoveImageArgs = {
    e: React.FormEvent<any>;
    index: number;
    imagesUrls: string[];
    imagesFiles: File[];
    setImagesFiles: ReactImagesFilesSetAction;
    setImagesUrls: ReactImagesUrlsSetAction;
};

const handleRemoveImage = ({ e, index, imagesUrls, imagesFiles, setImagesFiles, setImagesUrls }: HandleRemoveImageArgs) => {
    e.preventDefault();
    const updatedImagesUrls = imagesUrls.filter((_, i) => i !== index);
    const updatedImagesFiles = imagesFiles.filter((_, i) => i !== index);
    setImagesFiles(updatedImagesFiles);
    setImagesUrls(updatedImagesUrls);
};

type HandleFileChangeArgs = {
    e: React.ChangeEvent<HTMLInputElement>;
    setImagesFiles: ReactImagesFilesSetAction;
    imagesFiles: File[];
    setImagesUrls: ReactImagesUrlsSetAction;
};

const handleFileChange = ({ e, setImagesFiles, imagesFiles, setImagesUrls }: HandleFileChangeArgs) => {
    if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        selectedFiles.push(...imagesFiles); // Assuming imagesFiles is already a File[]

        const validFiles: File[] = [];
        const maxSize = 5 * 1024 * 1024; // 5MB

        selectedFiles.forEach((file) => {
            if (!file.type.startsWith('image/')) {
                alert(`File "${file.name}" is not a valid image.`);
                return;
            }
            if (file.size > maxSize) {
                alert(`File "${file.name}" exceeds the 5MB size limit.`);
                return;
            }
            validFiles.push(file);
        });

        const previewURLs = generatePreviewURLs(validFiles); // Generate preview URLs using the new function
        setImagesFiles(validFiles);
        setImagesUrls(previewURLs);
    }
};

const generatePreviewURLs = (files: File[]): string[] => {
    return files.map((file) => URL.createObjectURL(file));
};

type AddSpaceListenerArgs = {
    el: HTMLInputElement;
    onBlur: boolean,
    setProductValues: ReactProductSetAction
}

const addSpaceListener = ({ el, onBlur, setProductValues }: AddSpaceListenerArgs) => {
    const listener = (event: KeyboardEvent | boolean, onBlur?: boolean) => {
        if (!event) {
            if (onBlur) {

            }
            else {
                return false;
            }
        }
        else if (typeof (event) !== 'boolean') {
            if (event.code === "Space" || event.key === ' ' || event.code === "Enter") {

            }
            else {
                return false;
            }
        }
        if (el.value.trim().length > 0) {
            let key: keyof AdminProduct | '' = '';
            switch (el.id) {
                case "beltLength": key = "belt_lengths"; break;
                case "size": key = "sizes"; break;
                case "length": key = "lengths"; break;
                default: key = ''; break;
            }
            if (key !== '') {
                setProductValues((values) => {
                    const inputValue = el.value.trim();
                    if (key === 'belt_lengths' || key === 'lengths' || key === 'sizes') {
                        return {
                            ...values,
                            [key]: [...(values[key] as string[] | number[]), inputValue],
                            [el.id]: ''
                        };
                    } else {
                        return values;
                    }
                });
            }
        }
    };

    if (!onBlur) {
        el.addEventListener('keydown', listener);
    }
    else {
        listener(false, true);
    }
    return { el, listener };
};

const groupVariants = ({ acc, variant }: { acc: any, variant: Variant }) => {
    if (variant.belt_length) {
        if (!acc[variant.belt_length]) {
            acc[variant.belt_length] = [];
        }
        acc[variant.belt_length].push(variant);
    } else if (variant.size) {

        if (!acc.sizes) {
            acc.sizes = [];
        }
        acc.sizes.push(variant);
    }
    return acc;
}

type SetVariantQuantityKeyArgs = {
    productValues: AdminProduct,
    setProductValues: ReactProductSetAction,
    value: number,
    id: number
}

const setVariantQuantity = ({ productValues, setProductValues, value, id }: SetVariantQuantityKeyArgs) => {
    if (isNaN(value)) {
        value = 0;
    }
    const productVariantsArr = productValues.product_variants.map(v => v);
    productVariantsArr[id].quantity = value;
    setProductValues(values => ({
        ...values,
        product_variants: productVariantsArr
    }))
}

type UpdateProductVariantQuantitiesKeyArgs = {
    productValues: AdminProduct,
    unlimitedQuantity: boolean,
    checkedVariants: number[],
    setProductValues: ReactProductSetAction
}

const updateProductVariantQuantities = ({ productValues, unlimitedQuantity, checkedVariants, setProductValues }: UpdateProductVariantQuantitiesKeyArgs) => {
    const productVariantsArr = productValues.product_variants.map(v => v);
    console.log(checkedVariants);
    if (unlimitedQuantity) {
        for (let i = 0; i < productVariantsArr.length; i++) {
            if (checkedVariants.length !== 0) {
                for (let j = 0; j < checkedVariants.length; j++) {
                    if (productVariantsArr[i].id === checkedVariants[j] && productVariantsArr[i].quantity !== -1) {
                        productVariantsArr[i].quantity = -1;
                    }
                }
            }
            else {
                productVariantsArr[i].quantity = -1;
            }
            productVariantsArr[i].modified = true;
        }

    }
    else {
        for (let i = 0; i < productVariantsArr.length; i++) {
            if (checkedVariants.length !== 0) {
                for (let j = 0; j < checkedVariants.length; j++) {
                    if (productVariantsArr[i].id === checkedVariants[j] && productVariantsArr[i].quantity === -1) {
                        productVariantsArr[i].quantity = productValues.quantity;
                    }
                }
            }
            else {
                productVariantsArr[i].quantity = productValues.quantity;
            }
            productVariantsArr[i].modified = false;
        }
    }

    setProductValues(values => ({
        ...values,
        product_variants: productVariantsArr
    }));
}

type UpdateSizeVariantsKeyArgs = {
    productValues: AdminProduct,
    unlimitedQuantity: boolean,
    setProductValues: ReactProductSetAction,
}

const generateAndUpdateSizeVariants = ({ productValues, unlimitedQuantity, setProductValues }: UpdateSizeVariantsKeyArgs) => {
    const { sizes, product_variants: productVariants } = productValues;

    if (sizes.length > 0) {
        const existingSizes = new Set(productVariants.map(v => v.size));
        const newVariants = sizes
            .filter(size => !existingSizes.has(size))
            .map(size => ({
                size,
                id: productVariants.length,
                quantity: unlimitedQuantity ? -1 : productValues.quantity,
            }));

        setProductValues(values => ({
            ...values,
            product_variants: [...productVariants, ...newVariants],
        }));
    } else {
        setProductValues(values => ({
            ...values,
            product_variants: productVariants.filter(v => v.belt_length && v.length),
        }));
    }
}

type GenerateAndUpdateBeltLengthAndLengthVariantsKeyArgs = {
    productValues: AdminProduct,
    unlimitedQuantity: boolean,
    setProductValues: ReactProductSetAction
}

const generateAndUpdateBeltLengthAndLengthVariants = ({ productValues, unlimitedQuantity, setProductValues }: GenerateAndUpdateBeltLengthAndLengthVariantsKeyArgs) => {
    const { belt_lengths, lengths, product_variants: productVariants } = productValues;

    const generateVariants = () => {
        if (belt_lengths.length === 0 || lengths.length === 0) {
            return productVariants.filter(v => v.size);
        }
        const validBeltLengths = new Set(belt_lengths);
        const validLengths = new Set(lengths);

        const filteredVariants = productVariants.filter(v =>
            validBeltLengths.has(v.belt_length as string) && validLengths.has(v.length as string)
        );

        const newVariants = [] as Variant[];
        for (const beltLength of belt_lengths) {
            for (const length of lengths) {
                if (!filteredVariants.some(v => v.belt_length === beltLength && v.length === length)) {
                    newVariants.splice(newVariants.length, 0, {
                        belt_length: beltLength,
                        length,
                        id: filteredVariants.length + newVariants.length,
                        quantity: unlimitedQuantity ? -1 : productValues.quantity,
                    });
                }
            }
        }
        console.log('variants: ', [...filteredVariants, ...newVariants]);
        return [...filteredVariants, ...newVariants];
    };
    setProductValues(values => ({
        ...values,
        product_variants: generateVariants(),
    }));
}

export const AdminProductCEUtils = {
    removeArrayInputItem,
    handleChange,
    handleSubmit,
    handleRemoveImage,
    handleFileChange,
    generatePreviewURLs,
    addSpaceListener,
    groupVariants,
    setVariantQuantity,
    updateProductVariantQuantities,
    generateAndUpdateSizeVariants,
    generateAndUpdateBeltLengthAndLengthVariants
};

export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const descriptionSingleSignRegex = new RegExp(/(\r\n|\n|\r)/g);
export const descriptionDoubleSignRegex = new RegExp(/ {2,}/g);

export const replaceTextWraps = (text: string) => {

    const singleSignRegex = new RegExp(/(\r\n|\n|\r)/g);
    const doubleSignRegex = new RegExp(/ {2,}/g);
    return text
    .replace(singleSignRegex, "<br/>")
    .replace(doubleSignRegex, "<br/><br/>");

}

export const removeHtmlTags = (text : string) => {
    return text
    .replace(/<[^>]+>/g,"")
    .replace(/&nbsp;/g, ' ');
}

export function formatNumber(num : number) {
    let formattedNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    formattedNum += ',00';
    return formattedNum;
}