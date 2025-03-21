import { useContext, useMemo } from "react";
import { Temporal } from "temporal-polyfill";

import {
  getCalendarColor,
  getDayKeyFromDate,
} from "@/features/calendar/lib/utils";
import type { UIOccurrence } from "@/features/calendar/types/calendar.types";

import { cn } from "@/shared/lib/classes";
import { format } from "date-fns";

import {
  CalendarStoreContext,
  useCalendarStore,
} from "@/features/calendar/store/calendar-store-provider";
import { Heading } from "@/ui/heading";
import {
  ArrowRight02Icon,
  Clock02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const UpcomingEvents = () => {
  // Get the store context to access the store instance
  const calendarStore = useContext(CalendarStoreContext);

  // Memoize the current date to prevent it from changing on each render
  const now = useMemo(() => new Date(), []);

  // Memoize the day key to prevent recalculation on each render
  const todayKey = useMemo(() => {
    return getDayKeyFromDate(
      Temporal.PlainDate.from({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      }),
    );
  }, [now]);

  // Get layout occurrences with memoized dependency
  const layoutOccurrences = useCalendarStore((state) =>
    state.getLayoutOccurrences(todayKey),
  );

  const occurrenceIds = useMemo(() => {
    if (!layoutOccurrences || !Array.isArray(layoutOccurrences)) return [];
    return layoutOccurrences.map((layout) => layout.occurrenceId);
  }, [layoutOccurrences]);

  const upcomingOccurrences = useMemo(() => {
    if (!occurrenceIds.length || !calendarStore) return [];

    return occurrenceIds
      .map((id) => {
        const state = calendarStore.getState();
        return state.getUIOccurrence(id);
      })
      .filter((occ): occ is UIOccurrence => {
        return occ !== null && occ.startTime >= now;
      });
  }, [occurrenceIds, now, calendarStore]);

  return (
    <div className="flex flex-col gap-3 relative items-stretch">
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col items-center bg-overlay rounded-sm border-fg/25 border overflow-hidden ">
          <p className="text-xs bg-overlay-highlight px-3 py-0.5 text-muted-fg">
            {format(now, "MMM")}
          </p>
          <p className="py-0.5  font-semibold">{format(now, "dd")}</p>
        </div>
        <div>
          <Heading level={4}>Upcoming Events</Heading>
          <p className="text-sm text-muted-fg">Don't miss scheduled events</p>
        </div>
      </div>

      <div className="space-y-2">
        {upcomingOccurrences.length > 0 ? (
          upcomingOccurrences
            .slice(0, 3)
            .map((occurrence) => (
              <UpcomingOccurrenceCard
                key={`upcoming-occurrence-${occurrence.occurrenceId}`}
                occurrence={occurrence}
              />
            ))
        ) : (
          <EmptyUpcomingEvents />
        )}
      </div>
    </div>
  );
};

const EmptyUpcomingEvents = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center bg-overlay-highlight rounded-xl">
      <p className="text-sm font-medium mb-1">No upcoming events</p>
      <p className="text-xs text-muted-fg">Your schedule is clear for now</p>
    </div>
  );
};

const UpcomingOccurrenceCard = ({
  occurrence,
}: { occurrence: UIOccurrence }) => {
  const color = getCalendarColor(occurrence.color);

  return (
    <div
      className={cn(
        "bg-overlay-elevated",
        "relative h-full w-full flex items-stretch rounded-md gap-3 pl-1 pr-2",
        "hover:bg-secondary cursor-pointer",
      )}
    >
      <div
        className={cn(
          "my-1 rounded-lg w-1 shrink-0 min-w-0 min-h-0 border",
          color?.className,
        )}
      />
      <div
        className={cn("text-left flex flex-col gap-0 justify-between py-2.5")}
      >
        <div className="flex flex-row items-center gap-1.5">
          <HugeiconsIcon icon={Clock02Icon} size={12} />
          <div className="flex items-center gap-1 text-xs text-muted-fg">
            {format(occurrence.startTime, "HH:mm")}
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            {format(occurrence.endTime, "HH:mm")}
          </div>
        </div>
        <p className="text-sm line-clamp-2 font-normal leading-tight">
          {occurrence.title ?? "Untitled"}
        </p>
      </div>
    </div>
  );
};
