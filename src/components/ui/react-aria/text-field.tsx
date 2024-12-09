import { TextField as AriaTextField, Input } from "react-aria-components";

import type {
  TextFieldProps as AriaTextFieldProps,
  InputProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import {
  type FieldWrapperVariants,
  fieldWrapperVariants,
} from "./shared-styles/field-variants";

type TextFieldProps = AriaTextFieldProps &
  FieldWrapperVariants & {
    placeholder?: InputProps["placeholder"];
  } & {
    label?: string;
    description?: string;
    errorMessage?: string;
  };

export const TextField = ({
  size,
  className,
  placeholder,
  label,
  description,
  errorMessage,
  ...props
}: TextFieldProps) => {
  return (
    <AriaTextField {...props} className="">
      {label && <Label className="text-sm">{label}</Label>}
      <div className={cn(fieldWrapperVariants({ size }), "")}>
        <Input placeholder={placeholder} className="flex-1" />
      </div>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </AriaTextField>
  );
};
