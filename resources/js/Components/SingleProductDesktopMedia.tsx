import { CDN_URL } from "@/Constants/Consts";
import { getUrlPath } from "@/Utils/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import React, { useContext, useState } from "react";
import Loader from "./Loader";
import zoomIcon from '../../assets/zoom.svg';
import { PropsContext } from "@/Context/PropsContext";

export default function SingleProductDesktopMedia({ imageUrl, index }: 
    { imageUrl: string, 
      index: number,
    }) {
    const result = getUrlPath(imageUrl);
    const size = useWindowSize();
    const width = size?.width || 0;
    const [isLoaded, setIsLoaded] = useState(false);
    const {isZoom,setIsZoom,setZoomImg} = useContext(PropsContext);
    return (
        <div className={`relative
            ${index === 0 || (width >= 750 && width < 990) ? 'w-full shrink-0 grow' : 'max-w-[calc(50%-4px)]'}
        `}>
            {!isLoaded ? <Loader parentClass="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : null}
            <div className={`${index !== 0 || (width >= 750 && width < 990) ? 'max-w-[100%]' : 'desktop:w-[min(calc(max(500px,calc(100vh-170px)*0.66650390625)),100%)] mx-auto'}  border relative cursor-pointer group
                border-gray`} onClick={() => {setIsZoom(!isZoom);setZoomImg(imageUrl)}}>
                <img
                    src={`${CDN_URL}600xAUTO${result.path}`}
                    alt="Delinium Image"
                    onLoad={() => setIsLoaded(true)}
                    srcSet={`
                        ${CDN_URL}246xAUTO${result.path} 246w,
                        ${CDN_URL}493xAUTO${result.path} 493w,
                        ${CDN_URL}600xAUTO${result.path} 600w,
                        ${CDN_URL}713xAUTO${result.path} 713w,
                        ${CDN_URL}823xAUTO${result.path} 823w,
                        ${CDN_URL}990xAUTO${result.path} 990w,
                        ${CDN_URL}1100xAUTO${result.path} 1100w,
                        ${CDN_URL}1206xAUTO${result.path} 1206w,
                        ${CDN_URL}1346xAUTO${result.path} 1346w,
                        ${CDN_URL}1426xAUTO${result.path} 1426w,
                        ${CDN_URL}1646xAUTO${result.path} 1646w,
                        ${CDN_URL}1946xAUTO${result.path} 1946w
                    `}
                    width="1946"
                    height="2919"
                    sizes="
                (min-width: 1200px) 715px,
                (min-width: 990px) calc(65.0vw - 10rem),
                (min-width: 750px) calc((100vw - 11.5rem) / 2),
                calc(100vw / 1 - 4rem)
            "/>
                <div className="absolute flex top-4 left-4 opacity-0 group-hover:opacity-100 duration-100 ease items-center justify-center z-40 border border-gray rounded-full w-[30px] h-[30px]">
                    <img src={zoomIcon} width="12" height="12" />
                </div>
            </div>
        </div>
    )
}