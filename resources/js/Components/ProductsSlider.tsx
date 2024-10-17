import React, { PropsWithChildren } from "react";

export default function ProductsSlider({children} : PropsWithChildren) {
    return (
        <div className="flex flex-wrap gap-[4px] mt-[15px] px-6 tablet:gap-[8px] tablet:px-20 max-w-[120rem]">
            {children}
        </div>
    )
}