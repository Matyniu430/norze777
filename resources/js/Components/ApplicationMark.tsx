import React from 'react';
import logo from '../../assets/logo.webp';

export default function ApplicationMark(
  props: React.SVGProps<SVGSVGElement>,
) {
  return (
    <img src={logo} alt="norze logo" width="32px" height="32px" className='w-8 h-auto'/>
  );
}
