import React, { useRef, useState } from "react";
import SingleProductSliderMedia from "./SingleProductSliderMedia";
import carouselArrowIcon from '../../assets/chevron-down.svg';

export default function SingleProductImagesSlider({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
    const assignRef = (element: HTMLDivElement | null, index: number) => {
        mediaRefs.current[index] = element;
    };
    const scrollTo = (index: number) => {
        const element = mediaRefs.current[index]; // Access the first media ref

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: "nearest"
            });
        }

        setCurrentIndex(index);
    };

    return (
        <div>
            <div className='
            flex p-0 gap-1 mb-4 scroll-pl-6 w-full overflow-hidden
            scroll-pr-6
        '>
                {images.map((image, i) => (
                    <SingleProductSliderMedia
                        key={`${image} ${i}`}
                        imageUrl={image}
                        ref={(el) => assignRef(el, i)}
                    />
                ))}
            </div>
            <div className="flex justify-center items-center h-[44px]">
                <img src={carouselArrowIcon} className={`rotate-90 ${currentIndex - 1 < 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-125"}`} width="10px" height="14px"
                    onClick={() => 
                        currentIndex - 1 < 0 ? null :scrollTo(currentIndex - 1) 
                    }
                />
                <p className="text-[10px] text-center min-w-[4.4rem]">{currentIndex + 1}/{images.length}</p>
                <img src={carouselArrowIcon} className={`rotate-[-90deg] ${currentIndex + 1 > images.length - 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-125"}`} width="10px" height="14px"
                    onClick={() => {
                        currentIndex + 1 > images.length - 1 ? null : scrollTo(currentIndex + 1)
                    }}
                />
            </div>
        </div>
    )
}