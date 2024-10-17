import React, { useRef, useState } from 'react';
import ClientHeaderWrapper from './ClientHeaderWrapper';
import ClientFixedHeaderContainer from './ClientFixedHeaderContainer';

export default function ClientHeader() {
    return (
        <ClientFixedHeaderContainer>
            <header className={`
                border-b border-gray 
                bg-white h-[145px]
                relative
                z-50
                `
            }
            >
                <ClientHeaderWrapper />
            </header>
        </ClientFixedHeaderContainer>
    )
}