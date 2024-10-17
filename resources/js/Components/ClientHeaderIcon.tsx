import { PropsContext } from '@/Context/PropsContext';
import { DBSingleProductCart, PropsContextType } from '@/types';
import { getCookie } from '@/Utils/utils';
import { Link } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

interface Props {
    icon: string,
    className?: string,
    href?: string,
    isCart?: boolean,
    context?: PropsContextType,
    onClick?: () => void
}

export default function ClientHeaderIcon({
    icon,
    className,
    href,
    isCart,
    onClick,
    context
}:
    Props
) {
    const [itemsCount, setItemsCount] = useState(0);
    useEffect(() => {
        if (context) {
            if (context.hasCart || context.DBCart) {
                const { DBCart: DBCartObj } = context
                setItemsCount(DBCartObj.value.itemsCount);
            }
        }
    }, [context]);
    useEffect(() => {
        async function getCartItemsCount() {
            const XSRF_TOKEN = getCookie('XSRF-TOKEN');
            await fetch('http://127.0.0.1:8000/cart/length', {
                method: "GET",
                headers: {
                    'X-XSRF-Token': XSRF_TOKEN
                }
            })
                .then(res => res.json())
                .then(data => setItemsCount(data.count));
        };
        isCart === true ? getCartItemsCount() : null;
    }, []);
    return (
        <>
            <Link href={href ? href : ''} onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                }
            }} className='flex relative items-center'>
                <div className={`${classNames(className)}`}>
                    <img src={icon} className='hover:scale-105' />
                    {itemsCount > 0 && isCart === true &&
                        <div className='absolute text-[0.4em] text-white w-[20px] h-[20px] flex items-center justify-center bg-black top-1/2 left-1/2 rounded-full'>
                            {itemsCount}
                        </div>
                    }
                </div>
            </Link>
        </>

    )
}