import classNames from 'classnames';
import React from 'react';

export default function Checkbox(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  return (
    <input
      type="checkbox"
      name="checkbox"
      id="checkbox"
      {...props}
      className={classNames(
        `rounded border-gray-300 dark:border-gray-700 text-blue-600 shadow-sm ${!props.className?.includes('focus:ring') ? 'focus:ring-indigo-500' : ''}`,
        props.className,
      )}
    />
  );
}
