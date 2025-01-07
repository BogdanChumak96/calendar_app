import { FC, MouseEvent } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useCalendarStore } from "@/store/calendarStore";
import { CalendarView } from "@/common/types";

export const CalendarController: FC = () => {
  const { view, setView } = useCalendarStore();
  const handleChange = (_: MouseEvent<HTMLElement>, newView: CalendarView) => {
    setView(newView);
  };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleChange}
      aria-label='view selector'
    >
      <ToggleButton value='month' aria-label='month view'>
        Month View
      </ToggleButton>
      <ToggleButton value='week' aria-label='week view'>
        Week View
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
