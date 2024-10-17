import classNames from "classnames";
import React from "react";

export default function CartItemOption({children,className}: {children:React.ReactNode,className?:string}) {
    return (
        <div className={`text-[0.5em] flex mt-[4px] py-[2px] ${classNames(className)}`}>
            {children}
        </div>
    )
}