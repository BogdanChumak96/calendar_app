import { FC } from "react";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { DayItem } from "./DayItem";

interface MonthViewProps {
  daysInMonth: number;
  firstDayOfWeek: number;
  tasks: { date: number; title: string; id: string }[];
  currentMonth: dayjs.Dayjs;
}

export const MonthView: FC<MonthViewProps> = ({
  daysInMonth = 30,
  firstDayOfWeek = 0,
  tasks = [],
  currentMonth = dayjs(),
}) => {
  const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;

  return (
    <Grid container spacing={1} columns={7}>
      {Array.from({ length: totalCells }).map((_, index) => {
        const day = index - firstDayOfWeek + 1;
        const cellDate = currentMonth.clone().date(day);
        const isValidDate = day > 0 && day <= daysInMonth;

        const dayTasks = tasks.filter((task) => {
          const taskDate = dayjs(task.date);
          const isSameDay = isValidDate && taskDate.isSame(cellDate, "day");

          return isSameDay;
        });

        const key = isValidDate
          ? cellDate.format("YYYY-MM-DD")
          : `empty-${index}`;

        return (
          <Grid size={1} key={key}>
            <DayItem
              day={isValidDate ? cellDate.format("D") : ""}
              tasks={dayTasks}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
