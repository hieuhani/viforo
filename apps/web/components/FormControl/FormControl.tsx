import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}
export const FormControl = forwardRef<HTMLInputElement, Props>(
  ({ label, ...props }, ref) => (
    <div>
      {label && (
        <label
          htmlFor={props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={props.name}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...props}
      />
    </div>
  )
);

FormControl.displayName = 'FormControl';
