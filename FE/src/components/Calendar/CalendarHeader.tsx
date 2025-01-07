import { FC, useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { CalendarView, Task } from "@/common/types";
import { useNavigate } from "react-router-dom";
import { getUserTasks, searchTasks } from "@/api/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTaskStore } from "@/store/taskStore";

interface CalendarHeaderProps {
  view: CalendarView;
  currentDate: dayjs.Dayjs;
  startOfWeek: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  view,
  currentDate,
  startOfWeek,
  onPrev,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTaskMap } = useTaskStore();

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getUserTasks,
    enabled: !searchQuery.trim(),
  });

  const updateTaskMap = (tasks: Task[]) => {
    const taskMap = new Map(
      tasks.map((task) => [
        task._id,
        { ...task, dueDate: dayjs(task.dueDate).format("YYYY-MM-DD") },
      ])
    );
    setTaskMap(taskMap);
  };

  useEffect(() => {
    if (!searchQuery.trim() && tasks) {
      updateTaskMap(tasks);
    }
  }, [searchQuery, tasks, updateTaskMap]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        searchTasks(query)
          .then((result) => {
            updateTaskMap(result);
            navigate(`/?query=${query}`);
          })
          .catch((error) => {
            console.error("Error searching tasks:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        if (tasks) {
          updateTaskMap(tasks);
        }
        navigate("/");
      }
    }, 300);
  };

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      sx={{ mb: 3 }}
    >
      <Typography variant='h4' className='font-bold'>
        {view === "month"
          ? currentDate.format("MMMM YYYY")
          : `${startOfWeek.format("D MMM YYYY")} - ${startOfWeek
              .add(6, "day")
              .format("D MMM YYYY")}`}
      </Typography>
      <Box display='flex' alignItems='center'>
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search tasks'
          variant='outlined'
          size='small'
          sx={{
            borderRadius: "4px",
            marginRight: "16px",
            input: {
              color: "var(--foreground)",
            },
          }}
          slotProps={{
            input: {
              endAdornment: loading ? (
                <CircularProgress
                  size={20}
                  sx={{ color: "var(--foreground)" }}
                />
              ) : null,
            },
          }}
        />
        <Button variant='outlined' onClick={onPrev} className='mr-2'>
          Previous
        </Button>
        <Button variant='outlined' onClick={onNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};
