import React, { useContext, useEffect, useRef, useState } from "react";
import ClientHeaderIcon from "./ClientHeaderIcon";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";
import { useWindowSize } from "@uidotdev/usehooks";
import { PropsContext } from "@/Context/PropsContext";
import cartIcon from '../../assets/cart.svg';
import CartNotification from "./CartNotification";
import searchIcon from '../../assets/search.svg';
import ClientHeaderSearchBar from "./ClientHeaderSearchBar";

export default function ClientHeaderWrapper() {
    const size = useWindowSize();
    const width = size?.width || 0;
    const context = useContext(PropsContext);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const toggleSearch = () => {
        setIsSearching(!isSearching);
    }

    return (
        <>
            <div className='
                page-width 
                grid 
                min-[990px]:grid-cols-[1fr_auto_1fr] 
                grid-cols-[1fr_2fr_1fr]
                min-[990px]:gap-x-8
                min-[990px]:px-20 
                desktop:py-[20px] 
                desktop:gap-x-[2rem] 
                items-center 
                h-full
                tablet:px-[3.2rem] 
                py-[10px] 
                relative
                px-[3rem]'
            >
                {width < 990 ? (
                    <ClientHeaderIcon icon={searchIcon} onClick={toggleSearch} className='justify-start' />
                ) : <div></div>}

                <Link className='p-3 justify-self-center' href='/'>
                    <ApplicationLogo className='w-[70px]' />
                </Link>

                <div className='ml-auto'> {/* This ensures the icons are aligned to the right */}
                    <div className='flex justify-end gap-[22px]'>
                        {width >= 990 ?
                            <>
                                <ClientHeaderIcon icon={searchIcon} onClick={toggleSearch} />
                                <ClientHeaderIcon icon={cartIcon} context={context} href="/cart" isCart={true} />
                            </>
                            : <ClientHeaderIcon icon={cartIcon} context={context} className='justify-end' href="/cart" isCart={true} />}
                    </div>
                </div>
                <ClientHeaderSearchBar
                    isSearching={isSearching}
                    toggleSearch={toggleSearch}
                    setIsSearching={setIsSearching}
                />
            </div>

            {context !== null && context.hasCart ? <CartNotification /> : null}
        </>
    )
}