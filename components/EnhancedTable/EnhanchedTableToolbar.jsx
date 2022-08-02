import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";

export default function EnhancedTableToolbar({ title, count, fetchRows }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Tooltip title="Refresh">
        <IconButton size="small" sx={{ mr: 2 }} onClick={fetchRows}>
          <Refresh />
        </IconButton>
      </Tooltip>

      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title} ({count})
      </Typography>
    </Toolbar>
  );
}
