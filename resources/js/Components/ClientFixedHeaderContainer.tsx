import { HeaderPropsContext } from "@/Context/HeaderSearchContext";
import { useWindowScroll } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";

export default function ClientFixedHeaderContainer({ children }: { children: React.ReactNode }) {
    const [previousY, setPreviousY] = useState(window.scrollY);
    const [prevYCopy, setPrevYCopy] = useState(0);
    const [{ y }] = useWindowScroll();
    const [isFixed, setIsFixed] = useState<any>(false);
    useEffect(() => {
        setPrevYCopy(previousY);
        if (y === 0) {
            setIsFixed({
                animate: false,
                isFixed: false
            });
        }
        if (y! <= 145 && isFixed.isFixed !== true) {
            setIsFixed({
                animate: false,
                isFixed: false
            });
        }
        if (y! > 145 && isFixed.animate === false && isFixed.isFixed === false) {
            setIsFixed({
                animate: false,
                isFixed: true
            });
        }
        if (y! > 145 && isFixed.animate === false && isFixed.isFixed === true && prevYCopy > (y ? y : 0)) {
            setIsFixed({
                animate: true,
                isFixed: true
            })
        }
        setPreviousY(y!);
    }, [y]);
    return (
        <div className={`
            top-0
            ${isFixed.isFixed ? "fixed" : "absolute"}
            ${isFixed.animate ? "duration-200" : ''}
            w-full
            z-50
            bg-white
            ${prevYCopy > (y ? y : 0) && isFixed.animate && isFixed.isFixed ? "top-0" : `${isFixed.animate === false && isFixed.isFixed ? 'top-[-145px]' : ''}`}
            ${prevYCopy < (y ? y : 0) && isFixed.animate && isFixed.isFixed ? "top-[-145px]" : `${isFixed.animate === false && isFixed.isFixed ? 'top-[-145px]' : ''}`}
    `}>
            {children}
        </div>
    )
}