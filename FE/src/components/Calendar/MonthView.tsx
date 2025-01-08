import { FC } from "react";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { DayItem } from "./DayItem";
import { useTaskStore } from "@/store";
import { Task, Holiday } from "@/common/types";

interface MonthViewProps {
  daysInMonth: number;
  firstDayOfWeek: number;
  tasks: Task[] | undefined;
  currentMonth: dayjs.Dayjs;
  holidays: Holiday[] | undefined;
}

const getTasksForDay = (tasks: Task[] | undefined, date: string) => {
  return tasks?.filter((task) => dayjs(task.dueDate).isSame(date, "day")) || [];
};

const getTotalCells = (daysInMonth: number, firstDayOfWeek: number) => {
  return Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
};

export const MonthView: FC<MonthViewProps> = ({
  daysInMonth,
  firstDayOfWeek,
  tasks,
  currentMonth,
  holidays,
}) => {
  const { setTaskCreation } = useTaskStore();

  const totalCells = getTotalCells(daysInMonth, firstDayOfWeek);

  const handleDayDoubleClick = (day: string) => {
    setTaskCreation(day, true);
  };

  return (
    <Grid container spacing={1} columns={7}>
      {Array.from({ length: totalCells }).map((_, index) => {
        const day = index - firstDayOfWeek + 1;
        const cellDate = currentMonth.clone().date(day).format("YYYY-MM-DD");
        const isValidDate = day > 0 && day <= daysInMonth;

        const dayTasks = isValidDate ? getTasksForDay(tasks, cellDate) : [];

        const key = isValidDate ? cellDate : `empty-${index}`;

        return (
          <Grid
            size={1}
            key={key}
            sx={{
              height: "170px",
              backgroundColor: isValidDate ? "#1E1E1E" : "#252526",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onDoubleClick={() => isValidDate && handleDayDoubleClick(cellDate)}
          >
            {isValidDate && (
              <>
                <div
                  className={`text-center text-sm font-medium border-b-1 border-white 
              ${
                dayjs().isSame(cellDate, "day")
                  ? "bg-primary/10 text-white border-primary"
                  : "text-gray-300 border-gray-700 hover:text-white hover:bg-gray-700"
              }`}
                >
                  {dayjs(cellDate).date()}
                </div>

                <DayItem day={cellDate} tasks={dayTasks} holidays={holidays} />
              </>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};
