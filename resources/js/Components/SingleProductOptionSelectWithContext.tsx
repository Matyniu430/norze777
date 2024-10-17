import { PropsContext } from "@/Context/PropsContext";
import React from "react";
import SingleProductOptionSelect from "./SingleProductOptionSelect";
import { PropsContextType } from "@/types";

export default function SingleProductOptionSelectWithContext({value} : {value:PropsContextType}) {
    return (
        <PropsContext.Provider value={value}>
            <SingleProductOptionSelect/>
        </PropsContext.Provider>
    )
}