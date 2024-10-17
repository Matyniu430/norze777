import { AdminProduct, GroupedVariants } from "@/types";
import React from "react";
import chevronIcon from '../../assets/chevron-down.svg';
import AdminProductVariant from "./AdminProductVariant";

interface Props {
    productValues: AdminProduct,
    groupedVariants: GroupedVariants,
    activeVariantGroup: number,
    checkedVariants: number[],
    setVariantQuantity: (value: number, id: number) => void,
    setCheckedVariants: React.Dispatch<React.SetStateAction<number[]>>,
    setActiveVariantGroup: React.Dispatch<React.SetStateAction<number>>
}

export default function AdminProductVariants(
    {
        productValues,
        groupedVariants,
        activeVariantGroup,
        checkedVariants,
        setVariantQuantity,
        setCheckedVariants,
        setActiveVariantGroup
    }: Props
) {
    return (
        <div className="flex flex-col gap-4">
            {productValues.product_variants.length > 0 ? (
                <>
                    {Object.entries(groupedVariants).map(([key, variants], i) => {
                        if (key !== "sizes") {
                            return (
                                <section className="flex flex-col gap-4" key={`beltLength-section-${i}`}>
                                    <div
                                        className="flex justify-between border border-gray bg-white cursor-pointer items-center dark:bg-gray-800 gap-4 p-5 shadow-sm flex-wrap rounded-lg"
                                        onClick={() => { activeVariantGroup === i ? setActiveVariantGroup(-1) : setActiveVariantGroup(i) }}
                                    >
                                        <h4 className="text-[0.6em]">Belt Length: {key}</h4>
                                        <img src={chevronIcon} className={`${activeVariantGroup === i ? 'rotate-180' : ''}`} alt="expand list button" width="15px" height="15px" />
                                    </div>
                                    <div className={`flex  ${activeVariantGroup === i ? 'max-h-[auto] pb-4' : 'max-h-[0]'} overflow-hidden ease-in-out flex-col gap-4 px-[0.625rem]`}>
                                        {variants.map((v, j) => (
                                            <AdminProductVariant
                                                type="beltLength"
                                                length={v.length!}
                                                setCheckedVariants={setCheckedVariants}
                                                checkedVariants={checkedVariants}
                                                quantity={v.quantity}
                                                setQuantity={setVariantQuantity}
                                                id={v.id!}
                                                beltLength={v.belt_length!}
                                                key={`variant-beltLength-${i}-${j}`}
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        }
                        return null;
                    })}

                    {groupedVariants.sizes && groupedVariants.sizes.length > 0 && (
                        <section className="flex flex-col gap-4">
                            {groupedVariants.sizes.map((v, j) => (
                                <AdminProductVariant
                                    type="size"
                                    size={v.size!}
                                    setCheckedVariants={setCheckedVariants}
                                    checkedVariants={checkedVariants}
                                    quantity={v.quantity}
                                    setQuantity={setVariantQuantity}
                                    id={v.id!}
                                    key={`variant-size-${j}`}
                                />
                            ))}
                        </section>
                    )}
                </>
            ) : null}
        </div>
    )
}