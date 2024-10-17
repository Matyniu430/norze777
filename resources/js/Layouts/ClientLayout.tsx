import ClientHeader from "@/Components/ClientHeader";
import ClientLayoutInnerWrapper from "@/Components/ClientLayoutInnerWrapper";
import Footer from "@/Components/Footer";
import { Head } from "@inertiajs/react";
import { useWindowScroll, useWindowSize } from "@uidotdev/usehooks";
import React, { PropsWithChildren, useEffect, useState } from "react";

interface Props {
    title: string,
}

export default function ClientLayout({
    title, children}:
    PropsWithChildren<Props>
) {
    const size = useWindowSize();
    const [previousY, setPreviousY] = useState(window.scrollY);
    const [isFixed, setIsFixed] = useState(false);
    const [{ y }] = useWindowScroll();
    useEffect(() => {
        if (y) {
            y <= previousY ? setIsFixed(false) : setIsFixed(true);
        }
    }, [y]);
    const width = size?.width || 0;
    return (
        <div>
            <Head title={title}/>
            <ClientLayoutInnerWrapper>
                {children}
            </ClientLayoutInnerWrapper>
            <Footer />
        </div>
    )
}