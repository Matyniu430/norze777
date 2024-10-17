import React, { useContext, useEffect, useRef } from "react";
import checkIcon from '../../assets/check.svg';
import { PropsContext } from "@/Context/PropsContext";
import { CDN_URL } from "@/Constants/Consts";
import { getUrlPath } from "@/Utils/utils";
import { SingleProductCart } from "@/types";
import { Link } from "@inertiajs/react";

export default function CartNotification() {
    const { previewImageUrl, cart, DBCart,processingData } = useContext(PropsContext);
    const { value: clientCart,setClientCart } = cart as { value: SingleProductCart,setClientCart: any }
    const {isProcessing} = processingData;
    const result = getUrlPath(previewImageUrl);
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
          setClientCart(null);
        }
      };
      window.addEventListener("mousedown", handleClickOutside);
      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    return (
        <>
            <div className=
                {`  
            absolute
            ${clientCart !== null && !isProcessing ? 'top-[145px]' : 'top-[-400px]'}
            duration-200
            z-10
            w-full
    `}
            >
                <div className='
                    tablet:page-width 
                    min-[990px]:px-20 
                    tablet:px-[3.2rem] 
                    tablet:py-[10px]
                    tablet:px-[3rem]
                    flex
                    justify-end
                '>
                    <div className='
                        tablet:max-w-[368px]
                        border
                        border-t-0
                        border-gray
                        max-[749px]:border-l-0
                        max-[749px]:border-r-0
                        w-[100%]
                        bg-white
                        px-[35px]
                        py-[25px]
                        shadow-absolute
                    ' ref={elementRef}>
                        {clientCart !== null ?
                            <>
                                <div className="flex gap-4">
                                    <img src={checkIcon} loading="lazy" alt="" width="12px" height="9px" />
                                    <p className="text-sm">Pozycję dodano do koszyka</p>
                                </div>

                                <div className="flex pt-[20px] pb-[30px]">
                                    <img src={`${CDN_URL}140xAUTO${result.path}`}
                                        className="border border-gray w-[70px]
                                mt-2
                                mr-6"
                                        loading="lazy"
                                        width="70px"
                                        height="98px"
                                    />
                                    <div>
                                        <p className="text-[15px] mb-2">{clientCart.name}</p>
                                        <div className="text-[14px] text-gray-750">
                                            {clientCart.belt_length !== null ?
                                                <>
                                                    <p>pas: {clientCart.belt_length}cm</p>
                                                    <p className="mt-[0.4rem]">długość: {clientCart.length}cm</p>
                                                </>
                                                :
                                                <p>rozmiar: {clientCart.size}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Link href="/cart" className="cart-btn">Pokaż koszyk ({DBCart.value.itemsCount})</Link>
                                <button className="cart-btn primary-btn bg-black text-white mt-[10px]">Realizuj Zakup</button>
                            </> : null}
                    </div>
                </div>
            </div>
        </>
    )
}