import React, { useContext } from "react";
import SingleProductOption from "./SingleProductOption";
import { PropsContext } from "@/Context/PropsContext";
import { PropsContextType } from "@/types";



export default function SingleProductOptionSelect() {
    const {legend,options} = useContext(PropsContext) as PropsContextType;
    return (
        <fieldset className="
            border-none max-w-[44rem] mb-[1.2rem]
        ">
            <legend className="
                mb-[0.2rem]
                text-sm
                text-gray-750
            ">{legend}</legend>
            {options.map((option: string , i: any) => (
                <SingleProductOption
                    option={option}
                    key={`${option} ${i}`}
                />
            ))}
        </fieldset>
    )
}