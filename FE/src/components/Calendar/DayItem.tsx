import React, { FC } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Task } from "@/common/types";
import { Holiday } from "@/common/types";
import { DraggableTasks } from "./DraggableTasks";
import dayjs from "dayjs";
import { HolidayTasks } from "./HolidayTasks";
import TaskInput from "./TaskInput";

interface DayItemProps {
  day: string;
  tasks: Task[] | undefined;
  holidays: Holiday[] | undefined;
}

export const DayItem: FC<DayItemProps> = ({
  day,
  tasks = [],
  holidays = [],
}) => {
  const currentDate = dayjs();
  const sortedTasks = tasks
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className='bg-primary/4 overflow-y-auto p-2'>
      <HolidayTasks holidays={holidays} currentDate={currentDate} day={day} />
      <Droppable droppableId={day}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='flex flex-col'
            style={{
              minHeight: "180px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
              overflowY: "auto",
            }}
          >
            <TaskInput day={day} />
            <DraggableTasks tasks={sortedTasks} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
