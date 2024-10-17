
import classNames from 'classnames';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

const ArrayInput = forwardRef<
    HTMLInputElement,
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
>((props, ref) => {
    const { children, ...restProps } = props;
    const arrValuesDivRef = useRef<HTMLDivElement>(null);
    const [arrDivWidth,setArrDivWidth] = useState<number>(0);
    useEffect(() => {
        if (arrValuesDivRef.current) {
          const totalWidth = arrValuesDivRef.current.offsetWidth;
          setArrDivWidth(totalWidth);
        }
      }, [props.children]);
      console.log(arrDivWidth);
    return (
        <div className='flex gap-4 relative'>
            <div className='absolute left-3 flex gap-4 z-999 top-1/2 translate-y-[-50%]' ref={arrValuesDivRef}>
                {props.children}
            </div>
            <input
                {...restProps}
                ref={ref}
                style={{paddingLeft: `${arrDivWidth !== 0 ? `calc(${arrDivWidth}px + 1rem)` : `0.75rem` }`}}
                className={classNames(
                    'border-gray dark:border-gray-700 w-full dark:bg-gray-900 dark:text-gray focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm',
                    `${props.disabled ? 'cursor-not-allowed' : ''}`,
                    props.className,
                )}
            />
        </div>
    )
});

export default ArrayInput;
