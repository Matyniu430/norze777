import classNames from "classnames";
import React from "react";

export default function Loader({className,parentClass} :{parentClass?:string,className?:string}) {
    return (
        <div className={`w-[1.2rem] ${classNames(parentClass)}`}>
            <svg aria-hidden="true" focusable="false" className={`spinner ${classNames(className)}`} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle className="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
            </svg>
        </div>
    )
}