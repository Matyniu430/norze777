import React from 'react';

export default function PaymentIcon({img,alt}: {img:string,alt:string}) {
    return (
        <li className='p-2'>
            <img src={img} width="38px" height="24px" alt={alt}/>
        </li>
    )
}