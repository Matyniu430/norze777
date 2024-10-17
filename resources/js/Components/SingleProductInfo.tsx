import { SingleProductT, Variant } from "@/types";
import React from "react";
import SingleProductForm from "./SingleProductForm";
import shareIcon from '../../assets/share.svg';
import { formatNumber } from "@/Utils/utils";

export default function SingleProductInfo({product,variants} : {product:SingleProductT,variants:Variant[]}) {
    const formatDescription = (description: string) => {
        return description.replace(/(?:\r\n|\r|\n)/g, '<br />');
      };
    
    const shareLink = () => {
        const url = window.location.href;
        const text = `${product.name} - Norze777`;
        if (navigator.share) {
            navigator.share({
                title: `${product.name} - Norze777`,
                text: text,
                url: url,
            })
            .catch((error) => console.error('Error sharing:', error));
        } else {
            alert(`Copy this link: ${url}`);
        }
    }
    return (
        <div className="
            tablet:w-[calc(50%-4px)]
            max-w-[100%]
            desktop:max-w-[35%]
            w-[calc(35%-4px)]
            desktop:pl-8
            tablet:pl-12
            w-full
            grow
            shrink-0
        ">
            <div className="
                sticky
                top-12
                z-[2]
                tablet:max-w-[60rem]
            ">
                <p className="text-xs w-full text-gray-750">NORZE</p>
                <h3 className="text-4xl mt-2">{product.name}</h3>
                <p className="text-sm mt-[15px]">{formatNumber(product.price)} zł PLN</p>
                <p className="text-xs mt-2  mb-6 text-gray-750">Z wliczonym podatkiem</p>
                <SingleProductForm product={product} variants={variants}/>
                <p className="text-sm text-gray-750" dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }} />
                <button className="
                    flex min-h-[4.4rem] items-center my-[1.5rem]
                "
                    onClick={shareLink}
                >
                    <img className="mr-4" width="12px" height="13px" src={shareIcon} alt="share product"/>
                    <p className="text-sm">Share</p>
                </button>
            </div>
        </div>
    )
}