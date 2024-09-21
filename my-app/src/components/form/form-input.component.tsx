import {ChangeEventHandler} from "react";
import {Control, FieldValues, Path} from "react-hook-form";
import {twMerge} from "tailwind-merge";

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "components/ui/form";
import {Input} from "components/ui/input";

type Props<TValues extends FieldValues> =
  Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "type" | "className" | "value" | "placeholder">
  & {
  control: Control<TValues>;
  name: Path<TValues>;
  label?: string | JSX.Element;
  isDisabled?: boolean;
  readOnly?: boolean;
  containerClassName?: string;
  icon?: JSX.Element;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  labelClassName?: string;
  errorClassName?: string;
};

export const FormInput = <TValues extends FieldValues>({
                                                         name,
                                                         label,
                                                         type,
                                                         placeholder,
                                                         className,
                                                         control,
                                                         isDisabled,
                                                         readOnly,
                                                         containerClassName,
                                                         icon,
                                                         onChange,
                                                         labelClassName,
                                                         errorClassName,
                                                       }: Props<TValues>) => (
  <FormField
    control={control}
    name={name}
    render={({field, fieldState: {error}}) => (
      <FormItem className={twMerge("relative w-full space-y-0", containerClassName)}>
        {label && (
          <FormLabel className={twMerge("absolute top-3 left-4", labelClassName)}>
            {label}
          </FormLabel>
        )}
        <FormControl>
          <Input
            type={type}
            id={name}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={readOnly}
            className={className}
            isError={!!error}
            icon={icon}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
          />
        </FormControl>
        <FormMessage className={twMerge(errorClassName)}/>
      </FormItem>
    )}
  />
);
