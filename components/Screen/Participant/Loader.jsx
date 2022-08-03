import { Box, LinearProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
