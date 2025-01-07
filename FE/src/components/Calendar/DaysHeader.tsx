import { FC } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DAYS_OF_WEEK } from "@/common/constants";

export const DaysHeader: FC = () => {
  return (
    <Grid container columns={7} spacing={1}>
      {DAYS_OF_WEEK.map((day) => (
        <Grid size={1} key={day}>
          <Typography variant='subtitle1' className='text-center font-semibold'>
            {day}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
