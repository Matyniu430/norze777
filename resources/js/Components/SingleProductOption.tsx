import { PropsContext } from "@/Context/PropsContext";
import { PropsContextType } from "@/types";
import React, { useContext } from "react";

export default function SingleProductOption({option} : {option:string}) {
    const {property,setter,currentOption} = useContext(PropsContext) as PropsContextType;
    return (
        <label onClick={() => setter(option,property)} className={`
            ${currentOption === option ? "bg-[rgb(18,18,18)] text-white" : ""}
            border border-gray-550 rounded-[40px] hover:border-black duration-200 inline-block px-[20px] cursor-pointer py-[10px]
            mt-[0.7rem] mr-[0.5rem] mb-[0.2rem] leading-none tracking-[0.1rem]
            text-xs text-center
        `}>
            <input type="text" value={option} className="hidden"/>
            {option}{property !== 'size' ? "cm" : null}
        </label>
    )
}