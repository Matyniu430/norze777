import { CDN_URL } from "@/Constants/Consts";
import { getUrlPath } from "@/Utils/utils";
import classNames from "classnames";
import React, { useState } from "react";
import Loader from "./Loader";

interface Props {
    parentClass?:string,
    imageUrl:string,
    childClass?:string
}

export default function HomeProductCardImage({ imageUrl, childClass = "", parentClass = "relative" } : Props) {
  const result = getUrlPath(imageUrl);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={classNames(isLoaded || parentClass.includes('absolute') ? parentClass : 'relative')}>
      {!isLoaded && (
        <Loader parentClass="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
      <img
        className={classNames(childClass, "ease-[cubic-bezier(.25,.46,.45,.94)]")}
        srcSet={`
          ${CDN_URL}165xAUTO${result.path} 165w,
          ${CDN_URL}360xAUTO${result.path} 360w,
          ${CDN_URL}533xAUTO${result.path} 533w,
          ${CDN_URL}720xAUTO${result.path} 720w,
          ${CDN_URL}940xAUTO${result.path} 940w,
          ${CDN_URL}1066xAUTO${result.path} 1066w,
          ${CDN_URL}2730xAUTO${result.path} 2730w
        `}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => { e.currentTarget.src = `${CDN_URL}533xAUTO${result.path}`; }}
        src={`${CDN_URL}533xAUTO${result.path}`}
        sizes="
          (min-width: 1200px) 267px,
          (min-width: 990px) calc((100vw - 130px) / 4),
          (min-width: 750px) calc((100vw - 120px) / 3),
          calc((100vw - 35px) / 2)
        "
        alt=""
        loading="lazy"
        width="2730"
        height="4096"
      />
    </div>
  );
}