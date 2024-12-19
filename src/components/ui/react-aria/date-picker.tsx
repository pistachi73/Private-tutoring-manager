import { cn } from "@/lib/utils";
import { Calendar01Icon } from "@hugeicons/react";
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";
import {
  DatePicker as AriaDatePicker,
  Button,
  Dialog,
  Group,
} from "react-aria-components";
import { Calendar, type CalendarProps } from "./calendar";
import { DateInput } from "./date-input";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Popover } from "./popover";
import {
  type FieldWrapperVariants,
  fieldWrapperVariants,
} from "./shared-styles/field-variants";

type DatePickerProps<T extends DateValue> = AriaDatePickerProps<T> &
  FieldWrapperVariants & {
    label?: string;
    description?: string;
    errorMessage?: string;
    calendarProps?: CalendarProps<T>;
  };

export const DatePicker = <T extends DateValue>({
  className,
  label,
  description,
  errorMessage,
  value,
  calendarProps,
  ...props
}: DatePickerProps<T>) => {
  return (
    <AriaDatePicker {...props} value={value} className={className}>
      <Group
        className={cn(
          fieldWrapperVariants({ size: "sm" }),
          "flex flex-row items-center justify-between pr-0 gap-4 overflow-hidden",
        )}
      >
        <DateInput className={"flex-1"} />
        <Button
          className={cn(
            "transition-colors h-full aspect-square flex items-center justify-center p-0 rounded-none  hover:bg-background-base-highlight",
            !value && "text-text-sub",
          )}
        >
          <Calendar01Icon size={16} />
        </Button>
      </Group>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
      <Popover placement="bottom">
        <Dialog>
          <Calendar {...calendarProps} />
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
};
