import { useEffect, useState } from "react";
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
import axios from "axios";
import Loader from "./Loader";
import AutocompleteField from "components/AutoCompleteField";

export default function Filter({
  filterSchool,
  onChangeFilterSchool,
  filter,
  onChangeFilter,
}) {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/common/school/names?e=admin");
        if (res?.data) setSchoolOptions(res.data);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, []);

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
          <AutocompleteField
            label="Sekolah"
            value={filterSchool.id || ""}
            onChange={onChangeFilterSchool("id")}
            options={schoolOptions.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            size="small"
            fullWidth
            select
            label="Cabang"
            value={filterSchool.branch || ""}
            onChange={onChangeFilterSchool("branch")}
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
