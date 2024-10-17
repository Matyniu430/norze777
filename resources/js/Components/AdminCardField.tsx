import classNames from "classnames";
import React from "react"

interface IField {
    fieldName: string,
    content: string | number,
    last?: boolean,
    children?:React.ReactNode
    className?:string
}

export default function AdminCardField({fieldName,content,last,className,children}: IField) {
    if (fieldName === "Description") {
        if (typeof(content) === 'string') {
            if (content.length > 20) {
                content = content.slice(0,15) + "...";
            }
        }
    }
    if (fieldName === "Price") {
        content = content + " PLN";
    }
    return (
        <div className={`flex flex-col max-sm:min-w-[40%] gap-y-2 min-[630px]:max-[720px]:min-w-24 min-w-36 ${last === true ? 'text-right' : ''} ${classNames(className)}`}>
            <p className="text-gray-750 text-xs">{fieldName}</p>
            {children || <p className="break-all">{content}</p>}
        </div>
    )
}