import { useWindowScroll, useWindowSize } from "@uidotdev/usehooks";
import React, { useEffect, useRef, useState } from "react";
import ClientHeader from "./ClientHeader";
import { PropsContext } from "@/Context/PropsContext";

export default function ClientLayoutInnerWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ClientHeader />
            <div className={`mt-[145px]`}>
                {children}
            </div>
        </>
    )
}