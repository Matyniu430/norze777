
import { CDN_URL, WEBSITE_URL } from "@/Constants/Consts";
import { SearchProduct, SearchSuggestion } from "@/types";
import { getUrlPath } from "@/Utils/utils";
import { Link } from "@inertiajs/react";
import React from "react";

type ResultsT = {
    type: string,
    products?: SearchProduct[],
    suggestions?: SearchSuggestion[]
}

interface Props {
    results: ResultsT
}

export default function ClientHeaderSearchBarResults({ results }: Props) {
    return (
        <div className="pb-4">
            <h2 className="text-xs px-6 pt-6 pb-3 text-gray">{results.type.toUpperCase()}</h2>
            <hr className="px-6 max-w-[calc(100%-3rem)] mx-auto"/>
            {results.products ?
                <ul>
                    {results.products.map((product, i) => {
                        const urlData = getUrlPath(product.previewImgUrl);
                        return (
                            <li className="hover:bg-gray-02 group">
                                <Link href={`${WEBSITE_URL}products/${product.name}`} className="flex items-center gap-[15px] py-4 px-6">
                                    <img src={`${CDN_URL}150xAUTO${urlData.path}`}
                                        alt={product.name}
                                        width="50" height="75"
                                        loading="lazy"
                                    />
                                    <p className="text-sm group-hover:underline underline-offset-[0.3rem]">{product.name}</p>
                                </Link>
                            </li>
                        )
                    })}
                </ul> : null
            }
        </div>
    )
}