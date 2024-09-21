import * as React from "react";
import {twMerge} from "tailwind-merge";

import {Label} from "./label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  icon?: JSX.Element | null;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  isDisabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      isError,
      icon,
      label,
      labelClassName,
      containerClassName,
      isDisabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={twMerge("relative w-full", containerClassName)}>
        {label && (
          <Label className={twMerge("absolute top-3 left-4", labelClassName)}>
            {label}
          </Label>
        )}
        <input
          type={type}
          className={twMerge(
            "flex w-full !mt-0 px-4 pt-8 pb-2 bg-white bg-opacity-5 text-white text-base font-medium leading-tight" +
            " placeholder:text-opacity-10 border border-white border-opacity-10 rounded-lg focus-visible:border " +
            "focus-visible:border-primary outline-none caret-primary duration-300 disabled:pointer-events-none",
            isError && "!border-red-600",
            className,
          )}
          disabled={isDisabled}
          ref={ref}
          autoComplete="new-password"
          {...props}
        />
        {icon}
      </div>
    );
  },
);
Input.displayName = "Input";

export {Input};
