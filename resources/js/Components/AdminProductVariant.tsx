import React, { SetStateAction } from "react";
import AdminProductVariantInputContainer from "./AdminProductVariantInputContainer";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";

type VariantType = "beltLength" | "length" | "size";

interface Props {
    type: VariantType,
    beltLength?: string,
    length?: string,
    size?: string,
    quantity: number,
    id: number,
    setQuantity: (value: number, id: number) => void,
    setCheckedVariants: React.Dispatch<SetStateAction<number[]>>,
    checkedVariants: number[]
}

export default function AdminProductVariant({ type, beltLength, length, size, quantity, setQuantity, id, setCheckedVariants, checkedVariants }: Props) {
    const toggleCheckedVariant = () => {
        const checkedVariantsArr = checkedVariants.map(v => v);
        const variantIndexInArray = checkedVariantsArr.indexOf(id);
  
        if (variantIndexInArray > -1) {
            checkedVariantsArr.splice(variantIndexInArray, 1);
            console.log(variantIndexInArray)
        }
        else {
            checkedVariantsArr.push(id);
        }
        console.log(`arr ${checkedVariantsArr}`);
        setCheckedVariants(checkedVariantsArr); 
    }
    return (
        <div className={`bg-white gap-4 p-5 overflow-hidden border border-gray shadow-md rounded-lg`}>
            <div className="flex gap-4 mb-4">
                <InputLabel>{checkedVariants.indexOf(id) > -1 ? "Remove from selected" : "Add to selected"}</InputLabel>
                <TextInput
                    type="checkbox"
                    name="variantCheckbox"
                    checked={checkedVariants.indexOf(id) > -1 ? true : false}
                    id="variantCheckbox"
                    className="cursor-pointer"
                    onChange={toggleCheckedVariant}
                />
            </div>
            <div className={`grid grid-cols-2 gap-4 ${type !== "size" ? 'tablet:grid-cols-3' : ""} flex-wrap`}>
                {type === "beltLength" || type === "length" ? (
                    <>
                        <AdminProductVariantInputContainer
                            inputValue={beltLength!}
                            disabled={true}
                            name={"belt_length"}
                            label={"Belt Length - cm"}
                        />
                        <AdminProductVariantInputContainer
                            className="justify-self-end tablet:justify-self-center"
                            inputValue={length!}
                            disabled={true}
                            name={"length"}
                            label={"Length - cm"}
                        />
                    </>
                ) :
                    <AdminProductVariantInputContainer
                        inputValue={size!}
                        disabled={true}
                        name={"size"}
                        label={"Size"}
                    />
                }
                <AdminProductVariantInputContainer
                    className={`tablet:justify-self-end ${type === "size" ? 'justify-self-end' : ''}`}
                    inputValue={quantity!}
                    disabled={false}
                    setQuantity={setQuantity}
                    id={id}
                    name={"quantity"}
                    label={"Quantity"}
                />
            </div>
        </div>
    )
}