import React from "react";
import TextInput from "./TextInput";
import InputLabel from "./InputLabel";
import classNames from "classnames";

interface Props {
    inputValue: string | number,
    disabled: boolean,
    name: string
    label: string,
    className?: string,
    id?: number,
    setQuantity?: (value: number, id: number) => void
}

export default function AdminProductVariantInputContainer(
    { inputValue, disabled, name, label, className, setQuantity, id }: Props
) {
    return (
        <div className={`max-w-min ${classNames(className)}`}>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <TextInput
                className={`${name !== 'quantity' ? "text-gray-750" : ''}`}
                type={`${name !== 'quantity' ? "text" : 'number'}`}
                value={inputValue.toString().trim()}
                onChange={name === 'quantity' ? (e) => { setQuantity!(parseInt(e.target.value), id!)} : () => { }}
                name={name}
                id={name}
                disabled={disabled}
            />
        </div>
    )
}