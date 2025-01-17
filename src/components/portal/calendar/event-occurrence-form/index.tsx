"use client";

import { ParticipantsSelect } from "@/components/ui/participants-select";
import {
  DatePicker,
  DatePickerContent,
} from "@/components/ui/react-aria/date-picker";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import { NumberField } from "@/components/ui/react-aria/number-field";
import {
  SelectField,
  SelectFieldContent,
  SelectTrigger,
} from "@/components/ui/react-aria/select-field";
import { fieldWrapperVariants } from "@/components/ui/react-aria/shared-styles/field-variants";
import { Switch, SwitchIndicator } from "@/components/ui/react-aria/switch";
import { TextField } from "@/components/ui/react-aria/text-field";
import { RecurrenceSelect } from "@/components/ui/recurrence-select";

import { Button } from "@/components/ui/button";
import {
  TimeCombobox,
  TimeComboboxContent,
} from "@/components/ui/time-combobox";
import {
  TimezoneCombobox,
  TimezoneComboboxContent,
} from "@/components/ui/timezone-combobox";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import {
  ArrowRight02Icon,
  CalendarAdd01Icon,
  Folder02Icon,
} from "@hugeicons/react";
import { CalendarDate } from "@internationalized/date";
import { useEffect, useRef } from "react";
import { Form, Separator } from "react-aria-components";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import type { SessionOcurrenceFormSchema } from "./schema";

const useEventOccurrenceForm = () =>
  useCalendarStore(
    useShallow((store) => ({
      hubs: store.hubs,
      setDraftEventOccurrence: store.setDraftEventOccurrence,
    })),
  );

export const SessionOccurrenceFrom = ({
  form,
  editingEventOccurrenceId,
  onCancel,
}: {
  form: UseFormReturn<z.infer<typeof SessionOcurrenceFormSchema>>;
  editingEventOccurrenceId?: number;
  onCancel: () => void;
}) => {
  const { hubs, setDraftEventOccurrence } = useEventOccurrenceForm();
  const timeComboboxTriggerRef = useRef<HTMLDivElement>(null);

  const startTime = useWatch({
    control: form.control,
    name: "startTime",
  });

  const endTime = useWatch({
    control: form.control,
    name: "endTime",
  });

  const date = useWatch({
    control: form.control,
    name: "date",
  });

  const isBillable = useWatch({
    control: form.control,
    name: "isBillable",
  });

  useEffect(() => {
    console.log("setdraftevent");
    if (!startTime || !endTime || !date) return;

    if (editingEventOccurrenceId === -1) {
      setDraftEventOccurrence({
        eventOccurrenceId: -1,
        startTime: new Date(
          date.year,
          date.month - 1,
          date.day,
          startTime.hour,
          startTime.minute,
        ),
        endTime: new Date(
          date.year,
          date.month - 1,
          date.day,
          endTime.hour,
          endTime.minute,
        ),
      });
    }
  }, [
    setDraftEventOccurrence,
    editingEventOccurrenceId,
    date,
    startTime,
    endTime,
  ]);

  const onSubmit = (values: z.infer<typeof SessionOcurrenceFormSchema>) => {
    console.log(values);
    const { date, startTime, endTime, timezone } = values;

    setDraftEventOccurrence({
      eventOccurrenceId: -1,
      startTime: new Date(
        date.year,
        date.month - 1,
        date.day,
        startTime.hour,
        startTime.minute,
      ),
      endTime: new Date(
        date.year,
        date.month - 1,
        date.day,
        endTime.hour,
        endTime.minute,
      ),
      timezone,
    });
  };

  const hubItems = hubs?.map((hub) => ({ id: hub.id, name: hub.name }));

  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="relative h-full flex flex-col justify-between"
    >
      {/* <div className="bg-gradient-to-t from-[#30EEAC]/30 to-transparent absolute bottom-0 left-0 h-[300px] w-full" /> */}
      <div className="py-6 z-20 relative">
        <div className="flex items-center gap-3 mb-6 px-4">
          <CalendarAdd01Icon
            size={24}
            variant="duotone"
            color="var(--color-text)"
          />
          <p className="text-lg font-medium"> Create / edit session</p> 
        </div>
        <div className="space-y-2">
          <div className="flex flex-row gap-1 px-2">
            <div className="w-full space-y-1">
              <Controller
                control={form.control}
                name="hubId"
                render={({
                  field: { onChange, value, ...restField },
                  fieldState: { error, invalid },
                }) => (
                  <SelectField
                    {...restField}
                    onSelectionChange={onChange}
                    selectedKey={value}
                    placeholder="Hub"
                    aria-label="Hub"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  >
                    <SelectTrigger
                      size={"sm"}
                      variant={"ghost"}
                      className={cn("w-full font-normal rounded-lg")}
                      icon={Folder02Icon}
                    />
                    <SelectFieldContent
                      placement="left top"
                      offset={12}
                      className="w-[250px]"
                      items={hubItems}
                    >
                      {({ id, name }) => (
                        <ListBoxItem id={id} showCheckIcon>
                          {name}
                        </ListBoxItem>
                      )}
                    </SelectFieldContent>
                  </SelectField>
                )}
              />
              <Controller
                control={form.control}
                name="title"
                render={({
                  field,
                  fieldState: { error, invalid, isDirty },
                }) => (
                  <TextField
                    {...field}
                    size={"sm"}
                    aria-label="Session title"
                    placeholder="Title"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    className={cn(
                      "w-auto ml-7",
                      "bg-transparent border-transparent transition-colors",
                      "hover:bg-base-highlight",
                    )}
                  />
                )}
              />
            </div>
          </div>
          <Separator className="bg-border" />

          <div className="flex flex-col gap-1 px-2">
            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState: { invalid, error } }) => (
                <DatePicker
                  {...field}
                  size={"sm"}
                  aria-label="Session date"
                  validationBehavior="aria"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className="border-transparent gap-0"
                >
                  <DatePickerContent placement="left top" offset={12} />
                </DatePicker>
              )}
            />
            <div
              ref={timeComboboxTriggerRef}
              className="flex items-center gap-2 w-full"
            >
              <Controller
                control={form.control}
                name="startTime"
                render={({ field: { onChange, value, ...restField } }) => (
                  <TimeCombobox
                    {...restField}
                    value={value}
                    onChange={onChange}
                    withIcon
                    className="border-transparent"
                  >
                    <TimeComboboxContent
                      triggerRef={timeComboboxTriggerRef}
                      placement="left top"
                      offset={12}
                    />
                  </TimeCombobox>
                )}
              />
              <div className="size-7 shrink-0 flex items-center justify-center bg-base-highlight/70 text-text-sub rounded-lg">
                <ArrowRight02Icon size={16} />
              </div>
              <Controller
                control={form.control}
                name="endTime"
                render={({ field: { onChange, value, ...restField } }) => (
                  <TimeCombobox
                    {...restField}
                    value={value}
                    onChange={onChange}
                    minValue={startTime}
                    className="border-transparent"
                  >
                    <TimeComboboxContent
                      triggerRef={timeComboboxTriggerRef}
                      placement="left top"
                      offset={12}
                    />
                  </TimeCombobox>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="timezone"
              render={({
                field: { onChange, value, ...restField },
                fieldState: { error, invalid },
              }) => (
                <TimezoneCombobox
                  {...restField}
                  onSelectionChange={onChange}
                  selectedKey={value}
                  aria-label="Session timezone"
                  errorMessage={error?.message}
                  className="border-transparent"
                >
                  <TimezoneComboboxContent
                    placement="left top"
                    offset={12}
                    className="max-h-[300px]! w-[300px]"
                  />
                </TimezoneCombobox>
              )}
            />
            <RecurrenceSelect
              selectedDate={new CalendarDate(2024, 12, 19)}
              onChange={(rrule) => console.log(rrule)}
            />
          </div>
          <Separator className="bg-border/20 h-0" />
          <div className="px-2">
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  {...field}
                  size={"sm"}
                  aria-label="Session title"
                  placeholder="Description"
                  validationBehavior="aria"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className={cn(
                    "w-auto min-h-10",
                    "bg-transparent border-transparent transition-colors",
                    "hover:bg-base-highlight",
                  )}
                  type="textarea"
                />
              )}
            />
          </div>

          <Separator className="bg-border/20 h-0" />

          <div className="flex flex-row items-center gap-3 w-full px-2">
            <Controller
              control={form.control}
              name="isBillable"
              render={({ field: { value, ...restField } }) => (
                <Switch
                  {...restField}
                  isSelected={value}
                  className={"h-10 gap-0"}
                >
                  <div className="h-full aspect-square flex items-center justify-center">
                    <SwitchIndicator size="sm" />
                  </div>
                  <p className="text-sm">Billable</p>
                </Switch>
              )}
            />
            {isBillable && (
              <div
                className={cn(
                  fieldWrapperVariants({ size: "sm" }),
                  "relative border-transparent flex items-center bg-base-highlight/70",
                )}
              >
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field: { onChange, ...field } }) => (
                    <NumberField
                      {...field}
                      size={"sm"}
                      aria-label="Session price"
                      placeholder="Price"
                      withButtons={false}
                      minValue={1}
                      formatOptions={{
                        style: "currency",
                        currency: "EUR",
                      }}
                      onChange={(price) => {
                        onChange(Number.isNaN(price) ? 1 : price);
                      }}
                      className={cn(
                        "flex-1 w-full min-h-8 h-8 px-2 ",
                        "bg-transparent border-transparent px-0 transition-colors text-sm placeholder:text-sm",
                        "hover:bg-base-highlight",
                        "pr-14",
                      )}
                    />
                  )}
                />
                <span className="absolute right-2 text-sm text-text-sub">
                  / session
                </span>
              </div>
            )}
          </div>
          <Separator className="bg-border/20" />
          <div className="flex flex-col gap-1 px-2">
            <Controller
              control={form.control}
              name="participants"
              render={({ field: { onChange, value, ...restField } }) => (
                <ParticipantsSelect
                  {...restField}
                  value={value}
                  onChange={onChange}
                  className="border-transparent"
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 p-4">
        <Button variant={"ghost"} size="sm" onPress={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="px-6" type="submit">
          Save
        </Button>
      </div>
    </Form>
  );
};
