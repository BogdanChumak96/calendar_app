import { FC } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";

interface CalendarHeaderProps {
  view: string;
  currentDate: dayjs.Dayjs;
  startOfWeek: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  view,
  currentDate,
  startOfWeek,
  onPrev,
  onNext,
  searchQuery,
  onSearchChange,
  loading,
}) => {
  const headerTitle =
    view === "month"
      ? currentDate.format("MMMM YYYY")
      : `${startOfWeek.format("D MMM YYYY")} - ${startOfWeek
          .add(6, "day")
          .format("D MMM YYYY")}`;

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      sx={{ mb: 3 }}
    >
      <Typography variant='h4' className='font-bold'>
        {headerTitle}
      </Typography>
      <Box display='flex' alignItems='center'>
        <TextField
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
          InputProps={{
            endAdornment: loading ? (
              <CircularProgress size={20} sx={{ color: "var(--foreground)" }} />
            ) : null,
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
