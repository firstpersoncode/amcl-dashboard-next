import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import generateUID from "utils/generateUID";
import PasswordField from "components/PasswordField";
import Loader from "../Loader";

export default function School({ onClose, fetchRows }) {
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name, isSwitch) => (e) => {
    setValues((v) => ({
      ...v,
      [name]: isSwitch ? e.target.checked : e.target.value,
    }));
    setErrors((v) => ({ ...v, [name]: undefined }));
  };

  const validate = () => {
    let hasError = false;

    if (!values.name) {
      hasError = true;
      setErrors((v) => ({ ...v, name: "Masukkan nama" }));
    }

    if (!values.email) {
      hasError = true;
      setErrors((v) => ({ ...v, email: "Masukkan email" }));
    } else if (
      !String(values.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      hasError = true;
      setErrors((v) => ({ ...v, email: "Format email tidak benar" }));
    }

    if (!values.password) {
      hasError = true;
      setErrors((v) => ({ ...v, password: "Masukkan password" }));
    }

    if (!values.category) {
      hasError = true;
      setErrors((v) => ({ ...v, category: "Masukkan kategori" }));
    }

    if (!values.branch) {
      hasError = true;
      setErrors((v) => ({ ...v, branch: "Masukkan cabang" }));
    }

    return hasError;
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasError = validate();
    if (hasError) return;

    setOpenConfirm(true);
  };

  const closeConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/school/create", {
        school: {
          ...values,
          idString: generateUID(),
          active: Boolean(values.active),
          completed: Boolean(values.completed),
          archived: false,
        },
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    closeConfirm();
    fetchRows();
    onClose();
  };

  return (
    <>
      {isLoading && <Loader />}
      <DialogTitle>
        <Typography>Sekolah</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={7} xs={12}>
              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                name="name"
                label="Nama"
                variant="standard"
                value={values.name || ""}
                onChange={handleChange("name")}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />

              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                name="email"
                label="Email"
                variant="standard"
                value={values.email || ""}
                onChange={handleChange("email")}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />

              <PasswordField
                sx={{ mb: 2 }}
                value={values.password || ""}
                onChange={handleChange("password")}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />

              {/* <FormGroup>
                <FormControlLabel
                  control={<Switch />}
                  label="Active"
                  checked={values.active || false}
                  onChange={handleChange("active", true)}
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Completed"
                  checked={values.completed || false}
                  onChange={handleChange("completed", true)}
                />
              </FormGroup> */}
            </Grid>

            <Grid item sm={5} xs={12}>
              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                select
                name="category"
                label="Kategori"
                value={values.category || ""}
                onChange={handleChange("category")}
                error={Boolean(errors.category)}
                helperText={errors.category}
              >
                <MenuItem value="js">SMP</MenuItem>
                <MenuItem value="hs">SMA</MenuItem>
                <MenuItem value="univ">Universitas</MenuItem>
              </TextField>

              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                select
                name="branch"
                label="Cabang"
                value={values.branch || ""}
                onChange={handleChange("branch")}
                error={Boolean(errors.branch)}
                helperText={errors.branch}
              >
                <MenuItem value="futsal">Futsal</MenuItem>
                <MenuItem value="dance">Dance</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
        </DialogContent>

        <DialogActions>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogActions>
      </form>

      <Dialog open={openConfirm} onClose={closeConfirm}>
        <DialogContent>
          Apakah Anda yakin ingin membuat sekolah baru?
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={closeConfirm}>
            Batal
          </Button>
          <Button disabled={isLoading} onClick={handleCreate}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
