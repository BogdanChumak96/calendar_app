import { FC } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { CalendarController } from "./CalendarController";
import { CustomTooltip } from "../Tooltip";

interface CalendarHeaderProps {
  view: string;
  currentDate: dayjs.Dayjs;
  startOfWeek: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
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
      sx={{ mb: 8 }}
    >
      <Box display='flex' alignItems='center' gap={2}>
        <Typography variant='h4' className='font-bold'>
          {headerTitle}
        </Typography>
        <CalendarController />
        <CustomTooltip />
      </Box>
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
            width: "250px",
            input: {
              color: "var(--foreground)",
            },
          }}
          InputProps={{
            endAdornment: loading && (
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress
                  size={20}
                  sx={{ color: "var(--foreground)" }}
                />
              </Box>
            ),
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
