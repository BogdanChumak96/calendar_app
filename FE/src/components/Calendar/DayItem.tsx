import { FC, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { TaskItem } from "./TaskItem";

interface DayItemProps {
  day: number | string;
  tasks: { id: string; title: string; date: number }[];
}

export const DayItem: FC<DayItemProps> = ({ day, tasks }) => {
  const [dayTasks, setDayTasks] = useState(tasks);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.destination.index === result.source.index) return;

    const updatedTasks = Array.from(dayTasks);
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);

    setDayTasks(updatedTasks);
  };

  return (
    <div className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg h-36 p-2 flex flex-col border border-gray-300 shadow-sm'>
      <span className='text-gray-500 text-sm'>{day}</span>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`day-${day}`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='overflow-y-auto flex-1 w-full'
            >
              {dayTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='mb-1 draggable'
                    >
                      <TaskItem title={task.title} date={task.date} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
