"use client";

import {
  Button,
  type ButtonProps,
  NumberField as NumberFieldPrimitive,
  type NumberFieldProps as NumberFieldPrimitiveProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/utils/use-media-query";
import { ArrowDown01Icon, ArrowUp01Icon, MinusSignIcon, PlusSignIcon } from "@hugeicons/react";
import { Description, FieldError, FieldGroup, type FieldGroupProps, Input, Label } from "./field";
import { composeTailwindRenderProps } from "./primitive";

const fieldBorderStyles = tv({
  base: "group-data-focused:border-primary/70 forced-colors:border-[Highlight]",
  variants: {
    isInvalid: {
      true: "group-data-focused:border-danger/70 forced-colors:border-[Mark]",
    },
    isDisabled: {
      true: "group-data-focused:border-input/70",
    },
  },
});

const numberFieldStyles = tv({
  slots: {
    base: "group flex flex-col gap-y-1.5",
    stepperButton:
      "h-10 cursor-default px-3 text-muted-fg data-pressed:bg-primary data-pressed:text-primary-fg group-data-disabled:bg-secondary/70 forced-colors:group-data-disabled:text-[GrayText]",
  },
});

const { base, stepperButton } = numberFieldStyles();

interface NumberFieldProps extends Omit<NumberFieldPrimitiveProps, "className"> {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: FieldGroupProps["size"];
  className?: {
    fieldGroup?: string;
    input?: string;
    primitive?: string;
  };
  ref?: any;
  showStepperButtons?: boolean;
}

const NumberField = ({
  label,
  placeholder,
  description,
  className,
  errorMessage,
  size,
  showStepperButtons = true,
  ref,

  ...props
}: NumberFieldProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <NumberFieldPrimitive
      {...props}
      className={composeTailwindRenderProps(className?.primitive, base())}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className={cn("overflow-hidden", className?.fieldGroup)} size={size}>
        {(renderProps) => (
          <>
            {isMobile && showStepperButtons ? (
              <StepperButton slot='decrement' className='border-r' />
            ) : null}
            <Input
              ref={ref}
              className={cn("tabular-nums", className?.input)}
              placeholder={placeholder}
            />
            <div
              className={fieldBorderStyles({
                ...renderProps,
                className: "grid h-10 place-content-center border-s",
              })}
            >
              {isMobile && showStepperButtons ? (
                <StepperButton slot='increment' />
              ) : (
                <div className='flex h-full flex-col'>
                  <StepperButton slot='increment' emblemType='chevron' className='h-5 px-1' />
                  <div
                    className={fieldBorderStyles({
                      ...renderProps,
                      className: "border-input border-b",
                    })}
                  />
                  <StepperButton slot='decrement' emblemType='chevron' className='h-5 px-1' />
                </div>
              )}
            </div>
          </>
        )}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </NumberFieldPrimitive>
  );
};

interface StepperButtonProps extends ButtonProps {
  slot: "increment" | "decrement";
  emblemType?: "chevron" | "default";
  className?: string;
}

const StepperButton = ({
  slot,
  className,
  emblemType = "default",
  ...props
}: StepperButtonProps) => {
  const icon =
    emblemType === "chevron" ? (
      slot === "increment" ? (
        <ArrowUp01Icon size={12} />
      ) : (
        <ArrowDown01Icon size={12} />
      )
    ) : slot === "increment" ? (
      <PlusSignIcon size={12} />
    ) : (
      <MinusSignIcon size={12} />
    );
  return (
    <Button className={stepperButton({ className })} slot={slot} {...props}>
      {icon}
    </Button>
  );
};

export { NumberField };
export type { NumberFieldProps };
