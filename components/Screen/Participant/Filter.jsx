import { useEffect, useState } from "react";
import {
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
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
        const res = await axios.get("/api/school/names");
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
            placeholder="ID, Nama, Email, NIM/NIS, No. Telephone, Instagram"
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
            options={schoolOptions.map((s, i) => ({
              label: s.name,
              value: s.id,
              key: i,
            }))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            fullWidth
            select
            label="Kategori"
            value={filterSchool.category || ""}
            onChange={onChangeFilterSchool("category")}
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
          <TextField
            size="small"
            fullWidth
            select
            label="Gender"
            value={filter.gender || ""}
            onChange={onChangeFilter("gender")}
          >
            <MenuItem value="">Semua</MenuItem>
            {[
              { value: "male", label: "Pria" },
              { value: "female", label: "Wanita" },
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
            label="Type"
            value={filter.type || ""}
            onChange={onChangeFilter("type")}
          >
            <MenuItem value="">Semua</MenuItem>
            {[
              { value: "participant", label: "Peserta" },
              { value: "official", label: "Official" },
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
