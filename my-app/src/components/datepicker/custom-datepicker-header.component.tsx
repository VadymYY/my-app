import {range} from "lodash";
import {FC, MouseEvent, MouseEventHandler, useEffect, useMemo, useRef, useState} from "react";
import {ReactDatePickerCustomHeaderProps} from "react-datepicker";
import {useTranslation} from "react-i18next";
import {twMerge} from "tailwind-merge";

import {datepickerMonthsOptions} from "constants/common.constants";

import {SelectInputOption} from "types/common.types";

import {useOnClickOutside} from "utils/use-on-click-outside";

import {ArrowIcon} from "assets/icons/arrow.icon";
import {SelectArrowIcon} from "assets/icons/select-arrow.icon";

import {Button} from "components/ui/button";

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  isPrevButton?: boolean;
}

interface CustomSelectProps {
  options: SelectInputOption[];
  onValueChange: (value: string) => void;
  value: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                     options,
                                                     onValueChange,
                                                     value,
                                                     className,
                                                   }) => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(value);
  const ref = useRef<HTMLUListElement | null>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: SelectInputOption) => () => {
    setSelectedOption(option.code);
    onValueChange(option.code);
    setIsOpen(false);
  };
  const renderOption = ({code, name}: SelectInputOption) => (
    <li
      key={code}
      onClick={handleOptionClick({code, name})}
      className={twMerge(
        "px-2.5 py-1 text-left text-base font-light cursor-pointer hover:bg-white hover:bg-opacity-10 flex",
        code === selectedOption && "bg-white bg-opacity-15",
      )}
    >
      {t(name)}
    </li>
  );
  const currentOptionName = useMemo(
    () => options.find((option) => option.code === selectedOption)?.name ?? "",
    [options, selectedOption],
  );

  return (
    <div className="relative">
      <div
        className={twMerge(
          "p-2 flex items-center justify-between bg-shark rounded-sm  text-white text-opacity-80 text-sm h-11",
          className,
        )}
        onClick={toggleSelect}
      >
        {selectedOption && t(currentOptionName)}
        <SelectArrowIcon/>
      </div>
      {isOpen && (
        <ul
          className="absolute top-[105%] left-0 h-48 bg-shark w-full border-white border-opacity-10 overflow-y-auto"
          ref={ref}
        >
          {options.map(renderOption)}
        </ul>
      )}
    </div>
  );
};

const ArrowButton: FC<ButtonProps> = ({isPrevButton, disabled, onClick}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="pagination"
      size="icon"
      className="!bg-shark w-8 h-8 group"
    >
      <ArrowIcon
        className={twMerge(
          "text-white group-hover:text-primary",
          isPrevButton && "rotate-180",
        )}
      />
    </Button>
  );
};

interface Props extends ReactDatePickerCustomHeaderProps {
  startYear?: number;
  endYear?: number;
}

export const CustomDatePickerHeader: FC<Props> = ({
                                                    date,
                                                    changeYear,
                                                    changeMonth,
                                                    decreaseMonth,
                                                    increaseMonth,
                                                    prevMonthButtonDisabled,
                                                    nextMonthButtonDisabled,
                                                    startYear,
                                                    endYear = new Date().getFullYear() + 1,
                                                  }) => {
  const onMonthSelectChange = (value: string | number) => changeMonth(Number(value));

  const onYearSelectChange = (value: string | number) => changeYear(Number(value));

  const years = range(startYear, endYear, 1);

  const yearsOptions = years
    .map((item) => ({
      name: item.toString(),
      code: item.toString(),
    }))
    .reverse();

  const handleDecreaseMonth = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    decreaseMonth();
  };

  const handleIncreaseMonth = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    increaseMonth();
  };

  return (
    <div className="flex w-full justify-between items-center">
      <ArrowButton
        onClick={handleDecreaseMonth}
        disabled={prevMonthButtonDisabled}
        isPrevButton
      />

      <div className="flex gap-x-2">
        <CustomSelect
          options={datepickerMonthsOptions}
          onValueChange={onMonthSelectChange}
          value={date.getMonth().toString()}
          className="min-w-28"
        />
        <CustomSelect
          options={yearsOptions}
          onValueChange={onYearSelectChange}
          value={date.getFullYear().toString()}
        />
      </div>

      <ArrowButton onClick={handleIncreaseMonth} disabled={nextMonthButtonDisabled}/>
    </div>
  );
};
