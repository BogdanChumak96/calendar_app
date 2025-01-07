import { FC } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskItem } from "./TaskItem";
import { Task } from "@/common/types";
import classNames from "classnames";

interface DraggableTasksProps {
  tasks: Task[];
}

export const DraggableTasks: FC<DraggableTasksProps> = ({ tasks }) => {
  return (
    <div>
      {tasks?.map((task, index) => (
        <Draggable key={task._id} draggableId={task._id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={provided.draggableProps.style}
            >
              <TaskItem
                title={task.title}
                completed={task.completed}
                taskId={task._id}
                className={classNames({
                  "line-through": task.completed,
                  "text-gray-500": task.completed,
                })}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
