import {
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";

export default function Filter({ filter, onChangeFilter }) {
  return (
    <Paper sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Cari"
            value={filter.search?.value || ""}
            onChange={onChangeFilter("search")}
            placeholder="ID, Nama, Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            size="small"
            fullWidth
            select
            label="Kategori"
            value={filter.category || ""}
            onChange={onChangeFilter("category")}
          >
            <MenuItem value="">Semua</MenuItem>
            {[
              { value: "js", label: "SMP" },
              { value: "hs", label: "SMA" },
              { value: "univ", label: "Universitas" },
            ].map((option, i) => (
              <MenuItem key={i} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            fullWidth
            select
            label="Cabang"
            value={filter.branch || ""}
            onChange={onChangeFilter("branch")}
          >
            <MenuItem value="">Semua</MenuItem>
            {[
              { value: "futsal", label: "Futsal" },
              { value: "dance", label: "Dance" },
            ].map((option, i) => (
              <MenuItem key={i} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
}
