import { DateTimePicker } from "@/components/ui/date-time-picker";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import {
  Calendar02Icon,
  Clock01Icon,
  RepeatIcon,
  UserGroupIcon,
} from "@hugeicons/react";
import { format } from "date-fns";
import { useCalendarContext } from "../calendar-context";

type SessionOccurrenceDetailsProps = {
  occurrence: SessionOccurrence;
};

export const SessionOccurrenceDetails = ({
  occurrence,
}: SessionOccurrenceDetailsProps) => {
  const { hubsMap } = useCalendarContext();

  const sessionOccurrenceHub = hubsMap?.[occurrence.hubId];

  if (!sessionOccurrenceHub) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-2 py-4 pl-8 w-[400px] relative",
        "after:absolute after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-2 after:h-[calc(100%-theme(spacing.6))] after:w-[3px] after:bg-[#30EEAC] after:content-['']",
      )}
    >
      <p className="text-lg font-semibold text-responsive-dark">
        {sessionOccurrenceHub.name}
      </p>
      tabs
      <div className="space-y-1">
        <p className="text-base font-medium">{occurrence.title}</p>
        <p className="text-base text-neutral-500 line-clamp-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          ullamcorper, nisl in commodo egestas, sem eros blandit nisi, vitae
          tincidunt nisi nisl sit amet elit. Sed ullamcorper, nisl in.
        </p>
      </div>
      <div className="flex flex-row items-start gap-6">
        <div className="space-y-1 basis-1/2">
          <div className="flex items-center gap-1">
            <Calendar02Icon size={14} />
            <span className="text-neutral-500 text-sm">Date</span>
          </div>
          <p className="text-base font-medium">
            {format(occurrence.startTime, "iiii, d MMMM")}
          </p>
        </div>
        <div className="space-y-1 basis-1/2">
          <div className="flex items-center gap-1">
            <Clock01Icon size={14} />
            <span className="text-neutral-500 text-sm">Time</span>
          </div>
          <p className="text-base font-medium">
            {format(occurrence.startTime, "HH:mm")} -{" "}
            {format(occurrence.endTime, "HH:mm")}
          </p>
        </div>
      </div>
      {occurrence.recurrenceRule && (
        <div className="space-y-1 ">
          <div className="flex items-center gap-1">
            <RepeatIcon size={14} />
            <span className="text-neutral-500 text-sm">Recurrence</span>
          </div>
          <p className="text-base font-medium">
            <span className="capitalize">
              {" "}
              {occurrence.recurrenceRule.frequency}
            </span>
            , until{" "}
            {format(occurrence.recurrenceRule.endDate, "iiii, d MMMM, yyyy")}
          </p>
        </div>
      )}
      <div className="space-y-1 ">
        <div className="flex items-center gap-1">
          <UserGroupIcon size={14} />
          <span className="text-neutral-500 text-sm">Participants</span>
        </div>
        <div className="flex items-center">
          <UserAvatar
            size="sm"
            className="[&:not(:first-child)]:-ml-2 size-7"
            userImage={"https://i.pravatar.cc/150?img=3"}
          />
          <UserAvatar
            userImage={"https://i.pravatar.cc/150?img=1"}
            size="sm"
            className="[&:not(:first-child)]:-ml-2 size-7"
          />
        </div>
      </div>
      <DateTimePicker />
    </div>
  );
};
