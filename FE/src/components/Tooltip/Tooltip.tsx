import { Box, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export const CustomTooltip = () => {
  return (
    <Tooltip
      title={
        <Box
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            padding: 2,
            borderRadius: 1,
            fontSize: "0.9rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div>- Drag and drop tasks between days to change their dates.</div>
          <div>- Use the search bar to filter tasks.</div>
          <div>- Switch between "Month" and "Week" views.</div>
          <div>- Double-click on an empty cell to add a new task.</div>
          <div>- Press "Enter" to confirm or "Escape" to cancel.</div>
        </Box>
      }
      arrow
      placement='bottom-start'
    >
      <IconButton>
        <InfoIcon
          sx={{
            color: "#1976d2",
            "&:hover": {
              color: "#004ba0",
            },
          }}
        />
      </IconButton>
    </Tooltip>
  );
};
