import { InputHTMLAttributes, forwardRef } from 'react';
import cs from 'classnames';
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
}
export const FormControl = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => (
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
        className={cs(
          'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
);

FormControl.displayName = 'FormControl';
