import { FC } from "react";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { DayItem } from "./DayItem";

interface WeekViewProps {
  startOfWeek: dayjs.Dayjs;
  tasks: { date: number; title: string; id: string }[];
}

export const WeekView: FC<WeekViewProps> = ({ startOfWeek, tasks }) => {
  return (
    <Grid container spacing={1} columns={7}>
      {Array.from({ length: 7 }).map((_, index) => {
        const day = startOfWeek.add(index, "day");

        const dayTasks = tasks.filter((task) =>
          dayjs(task.date).isSame(day, "day")
        );

        return (
          <Grid size={1} key={day.format("YYYY-MM-DD")}>
            <DayItem day={day.format("D MMM")} tasks={dayTasks} />
          </Grid>
        );
      })}
    </Grid>
  );
};
