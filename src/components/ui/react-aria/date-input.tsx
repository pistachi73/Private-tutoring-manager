import { cn } from "@/lib/utils";
import type { DateInputProps as AriaDateInputProps } from "react-aria-components";
import { DateInput as AriaDateInput, DateSegment } from "react-aria-components";

type DateInputProps = Omit<AriaDateInputProps, "children">;

export const DateInput = ({ className, ...props }: DateInputProps) => {
  return (
    <AriaDateInput
      {...props}
      className={cn("flex flex-1 items-center", className)}
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          className={cn(
            "tabular-nums px-0.5 rounded-sm",
            "focus:bg-background-base-highlight",
            " focus:caret-transparent",
            "data-[placeholder]:text-text-sub",
          )}
        />
      )}
    </AriaDateInput>
  );
};
