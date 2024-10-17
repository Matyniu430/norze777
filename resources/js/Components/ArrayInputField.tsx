import React from "react"

export default function ArrayInputField({field,onClick}: {field:string | number,onClick: () => void}) {
    return (
        <p onClick={onClick} className="rounded-md cursor-pointer bg-white px-2 py-1 border-gray border shadow-sm text-xs">
            {field}
        </p>
    )
}