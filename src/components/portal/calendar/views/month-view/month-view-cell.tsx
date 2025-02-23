"use client";

import { Popover } from "@/components/ui/new/ui";
import { getWeekdayAbbrev } from "@/lib/temporal/format";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { MultiplicationSignIcon } from "@hugeicons/react";
import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { getDayKeyFromDate } from "../../utils";
import { MonthViewOccurrence } from "./month-view-occurrence";

type MonthCalendarDayCellProps = {
  date: Temporal.PlainDate;
  dayIndex: number;
  rowIndex: number;
  isCurrentMonth: boolean;
};

const SESSION_OCCURRENCE_HEIGHT = 24 + 1;
const SESSION_OCCURRENCE_SPACING = 4;

export const MonthViewCell = ({
  dayIndex,
  date,
  isCurrentMonth,
}: MonthCalendarDayCellProps) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);

  const { dailyOccurrences, selectedDate } = useCalendarStore(
    useShallow((store) => ({
      selectedDate: store.selectedDate,
      dailyOccurrences: store.dailyOccurrencesGridPosition.get(dayKey),
    })),
  );

  const sessionsContainerRef = useRef<HTMLDivElement>(null);
  const totalOccurrences = dailyOccurrences?.length ?? 0;

  const [visibleOccurrences, setVisibleOccurrences] =
    useState<number>(totalOccurrences);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0] as ResizeObserverEntry;
      const sessionContainerHeight =
        entry.target.getBoundingClientRect().height;

      const visibleSessions = Math.floor(
        sessionContainerHeight /
          (SESSION_OCCURRENCE_HEIGHT + SESSION_OCCURRENCE_SPACING),
      );

      setVisibleOccurrences(visibleSessions);
    });

    if (sessionsContainerRef.current) {
      observer.observe(sessionsContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const isToday = date.day === Temporal.Now.plainDateISO().day;
  const isSelectedDate = date.day === selectedDate.day;

  return (
    <div
      className={cn(
        "flex flex-col items-center h-full w-full border-r border-t overflow-hidden pt-1",
        isCurrentMonth ? "" : "bg-lines-pattern",
        dayIndex === 0 && "border-l-0",
        dayIndex === 6 && "border-r-0",
        isSelectedDate && "bg-primary/10  text-light",
      )}
    >
      <span
        className={cn(
          "text-xs font-medium size-5 rounded-full flex items-center justify-center",
          isCurrentMonth ? "text-current" : "text-muted-fg",
          isToday && "bg-primary text-light",
        )}
      >
        {date.day}
      </span>
      <div
        ref={sessionsContainerRef}
        className="mt-1 overflow-hidden grow p-1 w-full space-y-1"
      >
        {dailyOccurrences?.slice(0, visibleOccurrences).map((occurrence) => (
          <MonthViewOccurrence
            key={`event-ocurrence-${occurrence.occurrenceId}`}
            occurrenceId={occurrence.occurrenceId}
          />
        ))}

        {visibleOccurrences < totalOccurrences && (
          <Popover
            isOpen={isViewAllOpen}
            onOpenChange={(open) => setIsViewAllOpen(open)}
          >
            <AriaButton className="h-6 w-full hover:bg-overlay-highlight rounded-md transition-colors text-xs">
              {totalOccurrences - visibleOccurrences} more
            </AriaButton>
            <Popover.Content
              placement="top"
              className="w-[300px] relative overflow-visible"
            >
              <Popover.Close
                appearance="plain"
                size="square-petite"
                className="absolute top-1 right-1 size-8 shrink-0"
              >
                <MultiplicationSignIcon size={16} />
              </Popover.Close>
              <Popover.Header className="flex flex-col items-center justify-center">
                <p className="text-sm text-text-sub lowercase">
                  {getWeekdayAbbrev(date)}
                </p>
                <p className="text-3xl font-medium text-responsive-dark ">
                  {date.day}
                </p>
              </Popover.Header>
              <Popover.Body className="space-y-1 w-full pb-4">
                {dailyOccurrences?.map((occurrence) => (
                  <MonthViewOccurrence
                    key={`event-ocurrence-${occurrence.occurrenceId}`}
                    occurrenceId={occurrence.occurrenceId}
                    className="text-sm h-7 px-2 w-full"
                    popoverProps={{
                      offset: 30,
                      placement: "left top",
                      className: "brightness-125",
                    }}
                    onEditPress={() => {
                      setIsViewAllOpen(false);
                    }}
                  />
                ))}
              </Popover.Body>
            </Popover.Content>
          </Popover>
        )}
      </div>
    </div>
  );
};
