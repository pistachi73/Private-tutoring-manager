"use client";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { CalendarRows } from "../calendar-rows";
import { HoursColumn } from "../components/hours-column";
import {
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
  getEventOccurrenceDayKey,
  getWeekDays,
} from "../utils";
import { DayWeekViewOccurrence } from "./day-week-view-occurrence";

const useWeekView = () =>
  useCalendarStore(
    useShallow(
      ({
        selectedDate,
        groupedEventOccurrences,
        handleCalendarColumnDoubleClick,
      }) => ({
        selectedDate,
        groupedEventOccurrences,
        handleCalendarColumnDoubleClick,
      }),
    ),
  );

export const WeekView = () => {
  const {
    selectedDate,
    handleCalendarColumnDoubleClick,
    groupedEventOccurrences,
  } = useWeekView();

  const selectedDateWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  return (
    <div className="flex flex-col h-full gap-2 relative overflow-hidden">
      <div className="w-full flex items-center pl-4">
        <div className="w-12 h-full mr-4" />
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={format(day, "iiiiii")}
              className={cn("flex-1 rounded-lg")}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-1 rounded-lg",
                  isSelected && "bg-base-highlight text-text-base",
                )}
              >
                <p className="text-sm text-text-sub lowercase">
                  {format(day, "iii")}
                </p>
                <p className="text-3xl font-medium text-text-base">
                  {day.getDate()}
                </p>
              </div>
            </div>
          );
        })}

        <div className="h-full w-3" />
      </div>
      <div className="pl-4 relative flex flex-col overflow-y-scroll">
        <div className="items-stretch flex flex-auto">
          <HoursColumn />
          <div className="flex flex-row w-full h-auto relative">
            <CalendarRows />
            {Array.from({ length: 7 }).map((_, weekDayIndex) => {
              const weekDay = addDays(selectedDateWeekStart, weekDayIndex);
              const weekDayKey = getEventOccurrenceDayKey(weekDay);
              const dayOccurrences = groupedEventOccurrences[weekDayKey];

              return (
                <div
                  key={`day-${weekDayIndex}`}
                  className="flex-1 relative not-last:border-r border-calendar-border"
                  onDoubleClick={(e) => {
                    handleCalendarColumnDoubleClick(e, weekDay);
                  }}
                >
                  {dayOccurrences?.map((group) =>
                    group.map((occurrence, index) => {
                      const widthPercentage = 100 / group.length;
                      const topPercentage = calculateOccurrenceTop(
                        occurrence.startTime,
                      );
                      const heightPercentage = calculateOccurrenceHeight(
                        occurrence.startTime,
                        occurrence.endTime,
                      );
                      return (
                        <DayWeekViewOccurrence
                          key={`event-occurrence-${occurrence.eventOccurrenceId}`}
                          className="z-20 pr-2"
                          occurrence={occurrence}
                          style={{
                            top: `${topPercentage}%`,
                            height: `${heightPercentage}%`,
                            width: `${widthPercentage}%`,
                            left: `${index * widthPercentage}%`,
                          }}
                        />
                      );
                    }),
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};