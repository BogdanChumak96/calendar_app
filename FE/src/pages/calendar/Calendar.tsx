import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import dayjs from "dayjs";
import { WeekView, MonthView, DaysHeader } from "@/components/";

const Calendar: React.FC = () => {
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(dayjs());

  const tasks = [
    {
      id: "1",
      date: dayjs("2025-01-01 10:00 AM").valueOf(),
      title: "iOS design in depth",
    },
    {
      id: "2",
      date: dayjs("2025-01-06 2:00 PM").valueOf(),
      title: "How We Structure Our CSS",
    },
    {
      id: "3",
      date: dayjs("2025-01-09 1:00 PM").valueOf(),
      title: "How to Structure an Editorial Calendar",
    },
    {
      id: "4",
      date: dayjs("2025-01-16 9:00 AM").valueOf(),
      title: "Trello for Charitable Donations",
    },
    {
      id: "5",
      date: dayjs("2025-01-16 11:30 AM").valueOf(),
      title: "Another Task for Day 16",
    },
    {
      id: "6",
      date: dayjs("2025-01-22 12:00 PM").valueOf(),
      title: "Wedding Planning With Trello",
    },
    {
      id: "7",
      date: dayjs("2025-01-22 3:00 PM").valueOf(),
      title: "Another Task for Day 22",
    },
  ];

  const startOfWeek = currentDate.startOf("week");
  const startOfMonth = currentDate.startOf("month");

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "month" | "week"
  ) => {
    if (newView !== null) setView(newView);
  };

  const handlePrev = () => {
    setCurrentDate((prev) =>
      view === "month" ? prev.subtract(1, "month") : prev.subtract(1, "week")
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === "month" ? prev.add(1, "month") : prev.add(1, "week")
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4' className='font-bold'>
          {view === "month"
            ? currentDate.format("MMMM YYYY")
            : `${startOfWeek.format("D MMM YYYY")} - ${startOfWeek
                .add(6, "day")
                .format("D MMM YYYY")}`}
        </Typography>
        <Box>
          <Button variant='outlined' onClick={handlePrev} className='mr-2'>
            Previous
          </Button>
          <Button variant='outlined' onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>

      <Box sx={{ my: 2 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label='view selector'
        >
          <ToggleButton value='month' aria-label='month view'>
            Month View
          </ToggleButton>
          <ToggleButton value='week' aria-label='week view'>
            Week View
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <DaysHeader />
        {view === "month" ? (
          <MonthView
            daysInMonth={startOfMonth.daysInMonth()}
            firstDayOfWeek={startOfMonth.day()}
            tasks={tasks}
            currentMonth={startOfMonth}
          />
        ) : (
          <WeekView
            startOfWeek={startOfWeek}
            tasks={tasks.map((task) => ({
              ...task,
              day: dayjs(task.date).date(),
            }))}
          />
        )}
      </Box>
    </Box>
  );
};

export default Calendar;
