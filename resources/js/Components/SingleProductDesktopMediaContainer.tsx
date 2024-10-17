import React, { useState } from "react";
import SingleProductDesktopMedia from "./SingleProductDesktopMedia";

export default function SingleProductDesktopMediaContainer({ imagesUrls }: { imagesUrls: string[] }) {
    return (
        <div className='
            w-[calc(50%-4px)]
            desktop:w-full
            pl-0
            sticky
            top-12
            z-[2]
            gap-x-[8px]
            gap-y-[8px]
            flex
            flex-wrap
        '>
            {imagesUrls.map((imageUrl, i) => (
                <SingleProductDesktopMedia
                    index={i}
                    key={`${imageUrl} ${i}`}
                    imageUrl={imageUrl}
                />
            ))}
        </div>
    )
}