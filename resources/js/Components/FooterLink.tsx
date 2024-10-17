import { Link } from "@inertiajs/react";
import React from "react";

export default function FooterLink({href,content}:{href:string,content:string}) {
    return (
        <li className='
            py-[1rem]
            tablet:mr-6
        '><Link href={`${href}`} className="hover:underline underline-offset-[0.3rem] hover:text-gray-750 decoration-black">{content.toLowerCase()}</Link></li>
    )
}