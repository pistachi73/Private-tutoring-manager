import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { GroupedCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import {
  ArrowRight02Icon,
  Clock01Icon,
  File02Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { format } from "date-fns";
import { Dialog, Separator } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { formatZonedDateTime } from "../views/day-week-view-occurrence";

const useEventOccurrenceDialog = () =>
  useCalendarStore(
    useShallow((store) => ({
      openEditEventOccurrence: store.openEditEventOccurrence,
    })),
  );

type EventOccurrenceDialogProps = {
  occurrence: GroupedCalendarOccurrence;
};

export const EventOccurrenceDialog = ({
  occurrence,
}: EventOccurrenceDialogProps) => {
  const { openEditEventOccurrence } = useEventOccurrenceDialog();

  const [parsedStartTime, parsedEndTime] = [
    parseAbsolute(
      occurrence.startTime.toISOString(),
      occurrence.timezone || getLocalTimeZone(),
    ),
    parseAbsolute(
      occurrence.endTime.toISOString(),
      occurrence.timezone || getLocalTimeZone(),
    ),
  ];

  return (
    <Dialog className="space-y-3 w-[300px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 flex items-center justify-center">
            <div className="size-3 rounded-full bg-lime-400" />
          </div>
          <p className="text-lg">{occurrence.title}</p>
        </div>
        <div className="text-sm flex items-start gap-2">
          <div className="w-5 flex items-center justify-center h-5">
            <Clock01Icon size={16} />
          </div>

          <div className="space-y-0.5">
            <p> {format(occurrence.startTime, "EEEE, dd LLLL y")}</p>
            <div className="text-sm flex items-center gap-1.5">
              <p className=" text-text-sub">
                {formatZonedDateTime(parsedStartTime)}
              </p>
              <ArrowRight02Icon
                color="var(--color-text-sub)"
                size={16}
                variant="solid"
              />
              <p className="text-text-sub">
                {formatZonedDateTime(parsedEndTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-border/20" />
      <div className="text-sm flex items-start gap-2">
        <div className="w-5 flex items-center justify-center h-5">
          <File02Icon size={16} />
        </div>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          ullamcorper, nisl in commodo egestas, sem eros blandit nisi.
        </p>
      </div>

      <Separator className="bg-border/20" />
      <div className="text-sm flex items-start gap-2">
        <div className="w-5 flex items-center justify-center h-5">
          <UserGroupIcon size={16} />
        </div>
        <div className="space-y-2 w-full">
          <p className="text-sm">Participants (2)</p>
          <div className="flex flex-row items-center not-last:-ml-4">
            <UserAvatar
              userImage={"https://i.pravatar.cc/150?img=1"}
              userName={"Oscar Pulido"}
              size="sm"
              className="size-9"
            />
            <UserAvatar
              userImage={"https://i.pravatar.cc/150?img=1"}
              userName={"Oscar Pulido"}
              size="sm"
              className="size-9"
            />
          </div>
        </div>
      </div>

      {/* <Separator className="bg-border/20" /> */}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline">
          Delete
        </Button>
        <Button
          size="sm"
          className="px-6"
          slot="close"
          onPress={() => {
            openEditEventOccurrence(occurrence.eventOccurrenceId);
          }}
        >
          Edit
        </Button>
      </div>
    </Dialog>
  );
};
