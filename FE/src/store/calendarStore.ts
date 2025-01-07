import { create } from "zustand";
import dayjs from "dayjs";
import { CalendarView } from "@/common/types";

interface CalendarStore {
  view: CalendarView;
  currentDate: dayjs.Dayjs;
  setView: (view: CalendarView) => void;
  setCurrentDate: (date: dayjs.Dayjs) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  view: CalendarView.Month,
  currentDate: dayjs(),
  taskMap: new Map(),

  setCurrentDate: (date) => set({ currentDate: date }),

  setView: (view) => {
    localStorage.setItem("calendarView", view);
    set({ view });
  },

  handlePrev: () => {
    set((state) => {
      const newDate =
        state.view === CalendarView.Month
          ? state.currentDate.subtract(1, CalendarView.Month)
          : state.currentDate.subtract(1, CalendarView.Week);
      localStorage.setItem("calendarDate", newDate.format());
      return { currentDate: newDate };
    });
  },

  handleNext: () => {
    set((state) => {
      const newDate =
        state.view === CalendarView.Month
          ? state.currentDate.add(1, CalendarView.Month)
          : state.currentDate.add(1, CalendarView.Week);
      localStorage.setItem("calendarDate", newDate.format());
      return { currentDate: newDate };
    });
  },
}));
