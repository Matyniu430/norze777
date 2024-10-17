import React, { PropsWithChildren } from 'react';

interface Props {
  value?: string;
  htmlFor?: string;
}

export default function InputLabel({
  value,
  htmlFor,
  children,
}: PropsWithChildren<Props>) {
  return (
    <label
      className="block font-medium text-sm text-gray-750 dark:text-gray"
      htmlFor={htmlFor}
    >
      {value || children}
    </label>
  );
}
