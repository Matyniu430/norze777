import React from "react";
import minusIcon from '../../assets/minus.svg';
import plusIcon from '../../assets/plus.svg';

interface Props {
    quantity: number,
    threshold?: number,
    children?: React.ReactNode,
    changeQuantity: (e: React.FormEvent<any>, action: string | boolean) => void
}

export default function QuantityInput({ quantity, threshold, changeQuantity, children }: Props) {
    return (
        <div className="flex">
            <div className="
                        text-black
                        min-h-[50px]
                        justify-between
                        relative
                        max-w-[150px]
                        w-[150px]
                        border border-gray-550
                        flex
                        items-center
                    ">
                <button className={`w-[40px] h-[50px] ${quantity - 1 < (threshold ?? 1) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    disabled={quantity - 1 < (threshold ?? 1)}
                    onClick={(e) => { changeQuantity(e, 'substract') }}
                >
                    <img src={minusIcon} className={`mx-auto ${quantity - 1 < (threshold ?? 1) ? 'opacity-50' : ''}`} alt="substract quantity" width="10px" height="10px" />
                </button>

                <input
                    type="number"
                    value={(threshold ?? 1) > quantity ? 1 : !/^0+$/.test(quantity.toString()) ?
                        quantity.toString().replace(/^0+/, "") :
                        quantity.toString().replace(/^0+(?!$)/, ""

                        )}  // Always show number without leading zero
                    onChange={(e) => { changeQuantity(e, false) }}
                    className="quantity-input h-[50px] focus:border-transparent focus:ring-0 relative border-none w-[calc(100%-80px)] text-center bg-transparent"
                />

                <button className="cursor-pointer w-[40px] h-[50px]"
                    onClick={(e) => { changeQuantity(e, 'add') }}
                >
                    <img src={plusIcon} className="mx-auto" alt="add quantity" width="10px" height="10px" />
                </button>
            </div>
            {children || null}
        </div>
    );
}