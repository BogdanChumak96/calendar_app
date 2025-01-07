import { FC } from "react";
import { Holiday } from "@/common/types";
import { TaskItem } from "./TaskItem";
import classNames from "classnames";
import dayjs from "dayjs";

interface HolidayTasksProps {
  holidays: Holiday[];
  currentDate: dayjs.Dayjs;
  day: string;
}

export const HolidayTasks: FC<HolidayTasksProps> = ({
  holidays,
  currentDate,
  day,
}) => {
  const dayHolidays = holidays.filter((holiday) => holiday.date === day);

  return (
    <div>
      {dayHolidays.length > 0 &&
        dayHolidays.map((holiday, index) => {
          const isPast = dayjs(holiday.date).isBefore(currentDate, "day");
          return (
            <TaskItem
              key={index}
              title={holiday.name}
              taskId={holiday.name}
              isHoliday
              className={classNames(
                "bg-yellow-500 text-white cursor-default p-2 rounded-md mb-1",
                {
                  "line-through": isPast,
                  "text-gray-500": isPast,
                }
              )}
            />
          );
        })}
    </div>
  );
};