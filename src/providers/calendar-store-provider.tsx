// src/providers/calendar-store-provider.tsx
"use client";

import { type ReactNode, createContext, use, useRef } from "react";
import { useStore } from "zustand";

import {
  createCalendarStore,
  initCalendarStore,
} from "@/stores/calendar-store/calendar-store";
import type {
  CalendarStore,
  InitialCalendarStateData,
} from "@/stores/calendar-store/calendar-store.types";

export type CalendarStoreApi = ReturnType<typeof createCalendarStore>;

export const CalendarStoreContext = createContext<CalendarStoreApi | undefined>(
  undefined,
);

export interface CalendarStoreProviderProps {
  children: ReactNode;
  initialCalendarStore?: InitialCalendarStateData;
  skipHydration?: boolean;
}

export const CalendarStoreProvider = ({
  children,
  initialCalendarStore,
  skipHydration,
}: CalendarStoreProviderProps) => {
  console.log("CalendarStoreProvider");
  const storeRef = useRef<CalendarStoreApi | undefined>(undefined);

  if (!storeRef.current) {
    const initialState = initCalendarStore(initialCalendarStore);
    storeRef.current = createCalendarStore(initialState, skipHydration);
  }

  return (
    <CalendarStoreContext.Provider value={storeRef.current}>
      {children}
    </CalendarStoreContext.Provider>
  );
};

export const useCalendarStore = <T,>(
  selector: (store: CalendarStore) => T,
): T => {
  const calendarStoreContext = use(CalendarStoreContext);

  if (!calendarStoreContext) {
    throw new Error(
      "useCalendarStore must be used within CalendarStoreProvider",
    );
  }

  return useStore(calendarStoreContext, selector);
};
