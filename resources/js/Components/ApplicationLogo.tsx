import React from 'react';
import logo from '../../assets/logo.webp';

export default function ApplicationLogo({ className }: { className?: string }) {
  return (
    <img src={logo} alt="norze logo" className={`w-[40px] h-auto ${className ? className : ''}`}/>
  );
}
