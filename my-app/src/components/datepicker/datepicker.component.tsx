import dayjs from "dayjs";
import {FC, useState} from "react";
import DatePicker from "react-datepicker";
import {twMerge} from "tailwind-merge";

import {DATE_FORMAT_VALUE} from "constants/common.constants";

import {CalendarIcon} from "assets/icons/calendar.icon";

import {CustomDatePickerHeader} from "components/datepicker/custom-datepicker-header.component";
import {Input} from "components/ui/input";

interface Props {
  value?: string;
  maxDate?: Date;
  onChange: (...event: any[]) => void;
  isDisabled?: boolean;
  inputClassName?: string;
  label?: string;
}

const MAX_LENGTH = DATE_FORMAT_VALUE.length;

const getSelectedDate = (dateString: string) =>
  dateString.length === DATE_FORMAT_VALUE.length ? dayjs(dateString).toDate() : dayjs().toDate();

export const Datepicker: FC<Props> = ({
                                        maxDate = new Date(),
                                        value,
                                        onChange,
                                        isDisabled,
                                        inputClassName,
                                        label,
                                      }) => {
  const [dateInputValue, setDateInputValue] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = () => {
    if (isDisabled) {
      return;
    }
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateCalendarChange = (date: Date) => {
    setDateInputValue(date ? dayjs(date).format(DATE_FORMAT_VALUE) : "");
    onChange(date ? dayjs(date).format(DATE_FORMAT_VALUE) : "");
  };

  const onClickOutside = () => {
    setIsCalendarOpen(false);
  };

  const renderCalendarIcon = () => {
    if (isDisabled) {
      return null;
    }

    return (
      <div
        className="w-full h-full absolute top-0 left-0 group cursor-pointer"
        onClick={toggleCalendar}
      >
        <CalendarIcon
          className={twMerge(
            "absolute bottom-3 right-4 w-4 h-4 cursor-pointer text-white group-hover:text-primary",
          )}
          onClick={toggleCalendar}
        />
      </div>
    );
  };

  const renderCustomInput = () => (
    <Input
      placeholder={DATE_FORMAT_VALUE}
      disabled
      icon={renderCalendarIcon()}
      label={label}
      maxLength={MAX_LENGTH}
      className={twMerge(
        "pointer-events-none caret-transparent",
        isCalendarOpen && "!border-primary",
        inputClassName,
      )}
    />
  );

  return (
    <DatePicker
      selected={getSelectedDate(dateInputValue)}
      onChange={handleDateCalendarChange}
      customInput={renderCustomInput()}
      renderCustomHeader={CustomDatePickerHeader}
      value={value}
      showMonthDropdown
      peekNextMonth
      showYearDropdown
      dropdownMode="select"
      maxDate={maxDate}
      open={isCalendarOpen}
      onSelect={toggleCalendar}
      onClickOutside={onClickOutside}
      disabled={isDisabled}
    />
  );
};
