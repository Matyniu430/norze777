import React, { useEffect, useRef, useState } from "react";
import SingleProductDesktopMediaContainer from "./SingleProductDesktopMediaContainer";
import SingleProductImagesSlider from "./SingleProductImagesSlider";
import SingleProductInfo from "./SingleProductInfo";
import { useWindowSize } from "@uidotdev/usehooks";
import { SingleProductT, Variant } from "@/types";
import { PropsContext } from "@/Context/PropsContext";
import { getUrlPath } from "@/Utils/utils";
import { CDN_URL } from "@/Constants/Consts";

interface Props {
    variants: Variant[],
    images: string[],
    product: SingleProductT
}

export default function SingleProductContainer({ variants, images, product }: Props) {
    const [isZoom, setIsZoom] = useState<boolean>(false);
    const [zoomImg, setZoomImg] = useState<string>("");
    const size = useWindowSize();
    const width = size?.width || 0;
    const imageToScrollToRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        if (imageToScrollToRef.current && zoomImg !== "" && isZoom !== false) {
            console.log(isZoom);
            imageToScrollToRef.current.scrollIntoView({ block: "start", inline: "center" });
        }
    }, [zoomImg]);
    return (
        <div className="tablet:flex mx-0 my-auto page-width">
            <PropsContext.Provider value={{
                isZoom: isZoom,
                setIsZoom: setIsZoom,
                setZoomImg: setZoomImg
            }}>
                {width >= 750 ?
                    <SingleProductDesktopMediaContainer imagesUrls={images} /> :
                    <SingleProductImagesSlider
                        images={images}
                    />
                }
            </PropsContext.Provider>
            <SingleProductInfo variants={variants} product={product} />
            {isZoom ?
                <div className={`
                cursor-scroll ${width >= 750 ? 'absolute px-[min(110px,11rem)] overflow-y-scroll w-full pb-6 flex justify-center flex-wrap' : ''} cursor-zoom-out bg-white left-0 top-0 z-[200]
                ${width < 750 ? "fixed w-[1100px] h-[100vh] overflow-scroll" : ""}
            `} onClick={() => setIsZoom(false)}>
                    <>
                        {images.map((image, i) => {
                            if (width < 750 && zoomImg !== image) {
                                return;
                            }
                            const result = getUrlPath(image);
                            return (
                                <img
                                    className={`${width >= 750 ? 'w-[100%] border border-gray mt-6' : ''}`}
                                    srcSet={`
                                ${CDN_URL}550xAUTO${result.path} 550w,
                                ${CDN_URL}1100xAUTO${result.path} 1100w,
                                ${CDN_URL}1445xAUTO${result.path} 1445w,
                                ${CDN_URL}${result.path.replace('/', "")} 1500w
                            `}
                                    ref={zoomImg === image ? imageToScrollToRef : null}
                                    sizes="(min-width: 750px) calc(100vw - 22rem), 1100px"
                                    src={`${CDN_URL}1445xAUTO${result.path}`}
                                    alt={product.name}
                                    loading="lazy"
                                    width="1100"
                                    height="1540"
                                />);
                        })}
                    </>
                </div> : null}
        </div>
    )
}