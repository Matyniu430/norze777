import React from "react";
import SecondaryButton from "./SecondaryButton";
import { Link } from "@inertiajs/react";

interface Props {
    children: React.ReactNode
}

export default function AdminCardContainer({
    children
} : Props) {
    return (
        <div className="
            bg-white flex flex-col tablet:flex-row tablet:justify-between 
            p-5 overflow-hidden gap-3 shadow-xl border border-gray flex-wrap rounded-lg
        ">
            {children}    
        </div>
    )
}