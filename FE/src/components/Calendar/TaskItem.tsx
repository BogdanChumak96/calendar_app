import { FC } from "react";
import dayjs from "dayjs";

interface TaskItemProps {
  title: string;
  date: number;
}

export const TaskItem: FC<TaskItemProps> = ({ title, date }) => {
  const time = dayjs(date).format("HH:mm");

  return (
    <div className='bg-primary/40 dark:bg-gray-700 rounded-md p-1 mb-1 shadow text-xs text-gray-700 dark:text-gray-200 flex items-center'>
      <span className='time mr-2 text-gray-600 dark:text-gray-400'>{time}</span>

      <span className='task-title'>{title}</span>
    </div>
  );
};
