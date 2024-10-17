import { CDN_URL } from "@/Constants/Consts";
import { getUrlPath } from "@/Utils/utils";
import classNames from "classnames";
import React, { forwardRef, useContext, useState } from "react";
import Loader from "./Loader";
import { PropsContext } from "@/Context/PropsContext";

// Refactor to use forwardRef
const SingleProductSliderMedia = forwardRef<HTMLDivElement, { imageUrl: string }>(
  ({ imageUrl }, ref) => {
    const result = getUrlPath(imageUrl);
    const [isLoaded,setIsLoaded] = useState(false);
    const {isZoom,setIsZoom,setZoomImg} = useContext(PropsContext);
    return (
      <div
        ref={ref} // Assign the ref to the outermost container
        className={classNames(`
            w-[calc(100%-4px)]
            py-2
            min-w-[35%]
            max-w-[100%]
            shrink-0
            flex 
            items-center
            justify-center
            grow
        `)}
      >
        <div
          className={`
            w-[min(calc(max(300px,calc(100vh-400px))*0.6666666666666666),100%)]
            max-w-[calc(100%-2px)]
            border border-gray
            relative
        `} onClick={() => {setIsZoom(!isZoom); setZoomImg(imageUrl)}}
        >
          {!isLoaded ? <Loader parentClass="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : null}
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
            "
          />
        </div>
      </div>
    );
  }
);

export default SingleProductSliderMedia;
