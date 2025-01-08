import { FC, useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getHolidays, getTasks, updateTask } from "@/api";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useCalendarStore, useTaskStore, useSnackbarStore } from "@/store";
import { DaysHeader, MonthView, WeekView, CalendarHeader } from "@/components";
import dayjs from "dayjs";
import { useDebounce } from "@/hooks/useDebounce";
import { CalendarView, Holiday, Task } from "@/common/types";
import { useLogin } from "@/hooks";

const Calendar: FC = () => {
  const { view, currentDate, handlePrev, handleNext } = useCalendarStore();
  const { taskMap, setTaskMap } = useTaskStore();
  const { showSnackbar } = useSnackbarStore();
  const { isSuccess } = useLogin();

  const year = currentDate.year().toString();

  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem("searchQuery") || "";
  });

  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: holidays } = useQuery<Holiday[]>({
    queryKey: ["holidays", year],
    queryFn: () => getHolidays(year),
    refetchOnWindowFocus: false,
    enabled: isSuccess,
  });

  const { data: tasks, isFetching } = useQuery<Task[]>({
    queryKey: ["tasks", debouncedQuery],
    queryFn: ({ queryKey }) => {
      const [, query] = queryKey;
      return getTasks(query as string);
    },
    refetchOnWindowFocus: false,
    enabled: isSuccess,
  });

  const { mutate } = useMutation({
    mutationFn: ({
      taskId,
      taskUpdates,
    }: {
      taskId: string;
      taskUpdates: Partial<Task>;
    }) => updateTask(taskId, taskUpdates),
  });

  const updateTaskMap = useCallback(
    (tasks: Task[]) => {
      const taskMap = new Map(
        tasks.map((task) => [
          task._id,
          { ...task, dueDate: dayjs(task.dueDate).format("YYYY-MM-DD") },
        ])
      );
      setTaskMap(taskMap);
    },
    [setTaskMap]
  );

  useEffect(() => {
    if (tasks) {
      updateTaskMap(tasks);
    }
  }, [tasks, updateTaskMap]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    localStorage.setItem("searchQuery", query);
  }, []);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination } = result;

      if (
        !destination ||
        (source.droppableId === destination.droppableId &&
          source.index === destination.index)
      ) {
        return;
      }

      const allTasks = Array.from(taskMap.values());
      const sourceTasks = allTasks
        .filter((task) => task.dueDate === source.droppableId)
        .sort((a, b) => a.order - b.order);

      const destinationTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : allTasks
              .filter((task) => task.dueDate === destination.droppableId)
              .sort((a, b) => a.order - b.order);

      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (!movedTask) {
        console.error("Task not found at source index:", source.index);
        return;
      }

      if (source.droppableId !== destination.droppableId) {
        movedTask.dueDate = destination.droppableId;
      }

      destinationTasks.splice(destination.index, 0, movedTask);

      const updatedSourceTasks = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      const updatedDestinationTasks = destinationTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      const updatedTaskMap = new Map(taskMap);
      [...updatedSourceTasks, ...updatedDestinationTasks].forEach((task) =>
        updatedTaskMap.set(task._id, task)
      );

      setTaskMap(updatedTaskMap);

      try {
        const updatePromises = [
          ...updatedSourceTasks,
          ...updatedDestinationTasks,
        ].map((task) =>
          mutate({
            taskId: task._id,
            taskUpdates: { dueDate: task.dueDate, order: task.order },
          })
        );

        await Promise.all(updatePromises);

        showSnackbar("Task moved successfully!", "success");
      } catch (error) {
        console.error("Error updating tasks:", error);
        showSnackbar("Failed to update task order.", "error");
      }
    },
    [taskMap, mutate, showSnackbar, setTaskMap]
  );

  const startOfWeek = currentDate.startOf(CalendarView.Week);
  const startOfMonth = currentDate.startOf(CalendarView.Month);

  return (
    <Box sx={{ padding: 2 }}>
      <CalendarHeader
        view={view}
        currentDate={currentDate}
        startOfWeek={startOfWeek}
        onPrev={handlePrev}
        onNext={handleNext}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        loading={isFetching}
      />

      <Box>
        <DaysHeader />
        <DragDropContext onDragEnd={handleDragEnd}>
          {view === "month" ? (
            <MonthView
              daysInMonth={startOfMonth.daysInMonth()}
              firstDayOfWeek={startOfMonth.day()}
              tasks={Array.from(taskMap.values())}
              currentMonth={startOfMonth}
              holidays={holidays}
            />
          ) : (
            <WeekView
              startOfWeek={startOfWeek}
              tasks={Array.from(taskMap.values()).map((task) => ({
                ...task,
                day: dayjs(task.dueDate).date(),
              }))}
              holidays={holidays}
            />
          )}
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default Calendar;
