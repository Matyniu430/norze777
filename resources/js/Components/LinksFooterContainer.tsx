import { Link } from '@inertiajs/react';
import React from 'react';
import FooterLink from './FooterLink';

export default function FooterLinksContainer() {
    return (
        <div className='
            px-[30px]
            border-b
            border-gray
        '>
            <ul className='mb-[4rem] tablet:mb-[36px] text-gray text-sm tablet:flex justify-center'>
                <FooterLink content='Kontakt' href='/kontakt'/>
                <FooterLink content='Polityka Prywatności' href='/polityka-prywatnosci'/>
                <FooterLink content='Polityka Zwrotów' href='/polityka-zwrotow'/>
                <FooterLink content='Regulamin' href='/regulamin'/>
            </ul>
        </div>
    )
}