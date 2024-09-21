import {Control, FieldValues, Path} from "react-hook-form";
import {twMerge} from "tailwind-merge";

import {Datepicker} from "components/datepicker/datepicker.component";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "components/ui/form";

interface Props<TValues extends FieldValues> {
  control: Control<TValues>;
  name: Path<TValues>;
  isDisabled?: boolean;
  startYear?: number;
  endYear?: number;
  maxDate?: Date;
  label?: string | JSX.Element;
  containerClassName?: string;
}

export const FormDatePicker = <TValues extends FieldValues>({
                                                              name,
                                                              control,
                                                              maxDate = new Date(),
                                                              label,
                                                              containerClassName,
                                                            }: Props<TValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => {
        return (
          <FormItem className={twMerge("relative space-y-0", containerClassName)}>
            {label && <FormLabel className="absolute top-3 left-4">{label}</FormLabel>}
            <FormControl>
              <Datepicker
                value={field.value}
                maxDate={maxDate}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        );
      }}
    />
  );
};
