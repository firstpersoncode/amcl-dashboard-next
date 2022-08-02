import {
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
            placeholder="ID, ID Pemilik, Nama Pemilik"
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Dari tanggal"
              value={filter.scannedAt?.gte || ""}
              inputFormat="dd/MM/yyyy"
              onChange={(value) => {
                onChangeFilter("gte")({ target: { value } });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  error={false}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Sampai tanggal"
              value={filter.scannedAt?.lte || ""}
              inputFormat="dd/MM/yyyy"
              onChange={(value) => {
                onChangeFilter("lte")({ target: { value } });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  error={false}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
}
