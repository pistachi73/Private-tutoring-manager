import { TimeField as AriaTimeField } from "react-aria-components";

import { cn } from "@/lib/utils";
import { Clock01Icon } from "@hugeicons/react";
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from "react-aria-components";
import { DateInput } from "./date-input";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import {
  type FieldWrapperVariants,
  fieldWrapperVariants,
} from "./shared-styles/field-variants";

type TimeFieldProps<T extends TimeValue> = AriaTimeFieldProps<T> &
  FieldWrapperVariants & {
    label?: string;
    description?: string;
    errorMessage?: string;
  };

export const TimeField = <T extends TimeValue>({
  label,
  description,
  errorMessage,
  size,
  className,
  value,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <AriaTimeField {...props} className={cn("flex flex-col gap-1", className)}>
      {label && <Label className="text-sm">{label}</Label>}

      <div
        className={cn(
          fieldWrapperVariants({ size }),
          "flex flex-row items-center justify-between",
          !value && "text-neutral-500",
        )}
      >
        <DateInput />
        <Clock01Icon size={18} className={cn("ml-2")} />
      </div>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      {errorMessage && <FieldError> {errorMessage}</FieldError>}
    </AriaTimeField>
  );
};
