import { FC } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export const DaysHeader: FC = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Grid container columns={7} spacing={1}>
      {days.map((day) => (
        <Grid size={1} key={day}>
          <Typography variant='subtitle1' className='text-center font-semibold'>
            {day}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
