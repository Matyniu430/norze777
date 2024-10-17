import React from "react";

interface Props {
    fn: () => void,
    icon: string,
    isEnabled:boolean
}

export default function TextareaFormatOption({isEnabled,icon,fn} : Props) {
    
    return (
        <div className={`rounded-md hover:bg-gray-50 bg-white ease-in-out 
        duration-150 shadow-sm p-4 cursor-pointer border
        ${isEnabled === true ? 'border-indigo-500 ring-indigo-500' : 'border-gray-300'}
        `} onMouseDown={fn}>
            <img src={icon} alt="format option icon" className="w-4"/>
        </div>
    )
}