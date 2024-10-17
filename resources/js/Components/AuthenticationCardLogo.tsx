import { Link } from '@inertiajs/react';
import React from 'react';
import ApplicationLogo from './ApplicationLogo';

export default function AuthenticationCardLogo() {
  return (
    <Link href="/">
      <ApplicationLogo/>
    </Link>
  );
}
