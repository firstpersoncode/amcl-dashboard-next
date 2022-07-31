import { alpha } from "@mui/material/styles";

import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Refresh, Delete } from "@mui/icons-material";

export default function EnhancedTableToolbar({
  numSelected,
  title,
  count,
  fetchRows,
}) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Tooltip title="Refresh">
        <IconButton size="small" sx={{ mr: 2 }} onClick={fetchRows}>
          <Refresh />
        </IconButton>
      </Tooltip>

      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} dipilih
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title} ({count})
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
