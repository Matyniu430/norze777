import React from "react";
import FooterLinksContainer from "./LinksFooterContainer";
import FooterPaymentsContainer from "./PaymentsFooterContainer";

export default function Footer() {
    return (
        <footer className='
            py-[27px]
            tablet:py-[36px]
            border-t
            border-gray
        '>
            <div className='
            '>
                <FooterLinksContainer />
                <FooterPaymentsContainer />
                <div className="page-width">
                    <p className="text-xs text-gray text-center desktop:text-left mt-6">&copy;2024, Norze777</p>
                </div>
            </div>
        </footer>
    )
}