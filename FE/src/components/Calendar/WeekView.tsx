import { FC } from "react";
import Grid from "@mui/material/Grid2";
import { DayItem } from "./DayItem";
import dayjs from "dayjs";
import { Holiday, Task } from "@/common/types";

interface WeekViewProps {
  startOfWeek: dayjs.Dayjs;
  tasks: Task[] | undefined;
  holidays: Holiday[] | undefined;
}

export const WeekView: FC<WeekViewProps> = ({
  startOfWeek,
  tasks,
  holidays,
}) => {
  return (
    <Grid container spacing={1} columns={7}>
      {Array.from({ length: 7 }).map((_, index) => {
        const day = startOfWeek.add(index, "day");
        const cellDate = day.format("YYYY-MM-DD");

        const dayTasks = tasks?.filter((task) =>
          dayjs(task.dueDate).isSame(day, "day")
        );

        const isWeekend = day.day() === 0 || day.day() === 6;

        return (
          <Grid
            size={1}
            key={cellDate}
            sx={{
              height: "170px",
              backgroundColor: isWeekend ? "#2E2E2E" : "#1E1E1E",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "4px 0",
                fontSize: "14px",
                color: "#fff",
              }}
            >
              {day.format("D")}
            </div>
            <DayItem day={cellDate} tasks={dayTasks} holidays={holidays} />
          </Grid>
        );
      })}
    </Grid>
  );
};
