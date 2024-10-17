import React from "react";


export default function CheckoutSuccessAddress({children,heading} : {heading:string,children:React.ReactNode}) {
    return (
        <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold">{heading}</h3>
        <address className="text-sm not-italic">
            {children}
        </address>
    </div>
    )
}