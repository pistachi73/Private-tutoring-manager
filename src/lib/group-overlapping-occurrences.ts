import type {
  DatedOccurrence,
  OccurrenceGridPosition,
  TimeBoundary,
} from "@/components/portal/calendar/calendar.types";
import Heap from "heap-js";

export const groupOverlappingOccurrences = (
  occurrences: DatedOccurrence[],
): OccurrenceGridPosition[] => {
  if (occurrences.length === 0) {
    return [];
  }

  // Create time points for all start and end times
  const timeBoundaries: TimeBoundary[] = occurrences.flatMap((occurrence) => [
    {
      time: occurrence.startTime.epochMilliseconds,
      type: "start",
      occurrenceId: occurrence.id,
    },
    {
      time: occurrence.endTime.epochMilliseconds,
      type: "end",
      occurrenceId: occurrence.id,
    },
  ]);

  timeBoundaries.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.type === "end" ? -1 : 1; // 'end' comes before 'start' if times are equal
  });

  const occurrencesMap = new Map<number, DatedOccurrence>(
    occurrences.map((occurrence) => [occurrence.id, occurrence]),
  );
  const groups: OccurrenceGridPosition[][] = [];
  const activeEvents: Set<number> = new Set();

  // Heap to keep track of active columns sorted by endTime
  const activeColumnsHeap = new Heap<{ endTime: number; columnIndex: number }>(
    (a, b) => {
      if (a.endTime !== b.endTime) {
        return a.endTime - b.endTime;
      }
      return a.columnIndex - b.columnIndex;
    },
  );

  // Heap to keep track of available columns sorted by columnIndex
  const availableColumnsHeap = new Heap<number>((a, b) => a - b);

  let maxColumns = 0;
  let currentGroup: OccurrenceGridPosition[] = [];

  timeBoundaries.forEach((timeBoundary) => {
    const occurrence = occurrencesMap.get(timeBoundary.occurrenceId);
    if (!occurrence) return;

    if (timeBoundary.type === "start") {
      activeEvents.add(occurrence.id);

      // Release all columns that have ended before the current event's start time
      while (
        !activeColumnsHeap.isEmpty() &&
        activeColumnsHeap.peek()!.endTime <= timeBoundary.time
      ) {
        const freedColumn = activeColumnsHeap.pop()!.columnIndex;
        availableColumnsHeap.push(freedColumn);
      }

      // Assign a column
      let assignedColumn: number;
      if (!availableColumnsHeap.isEmpty()) {
        assignedColumn = availableColumnsHeap.pop()!;
      } else {
        assignedColumn = maxColumns;
        maxColumns += 1;
      }

      activeColumnsHeap.push({
        endTime: occurrence.endTime.epochMilliseconds,
        columnIndex: assignedColumn,
      });

      currentGroup.push({
        occurrenceId: occurrence.id,
        columnIndex: assignedColumn,
        totalColumns: maxColumns,
      });
    } else {
      activeEvents.delete(occurrence.id);
    }

    // If no active events, push the current group and reset
    if (activeEvents.size === 0) {
      // Set totalColumns for the group
      const totalCols = maxColumns;
      currentGroup.forEach((occ) => {
        occ.totalColumns = totalCols;
      });
      // Clear the heaps for the next group
      activeColumnsHeap.removeAll();
      availableColumnsHeap.removeAll();
      groups.push(currentGroup);
      currentGroup = [];
      maxColumns = 0;
    }
  });

  return groups.flat();
};
