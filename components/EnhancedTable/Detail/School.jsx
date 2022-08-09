import { useEffect, useState } from "react";
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
import PasswordField from "components/PasswordField";
import Loader from "../Loader";

export default function School({ detail, onClose, fetchRows }) {
  const [isLoading, setIsLoading] = useState(false);
  const [startValues, setStartValues] = useState({});
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/common/school/read", {
          idString: detail,
        });
        if (res?.data) {
          setStartValues(res.data);
          setValues(res.data);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [detail]);

  const handleChange = (name, isSwitch) => (e) => {
    setValues((v) => ({
      ...v,
      [name]: isSwitch ? e.target.checked : e.target.value,
    }));
    setErrors((v) => ({ ...v, [name]: undefined }));
  };

  useEffect(() => {
    let dirty = false;
    for (const field in { ...startValues, password: "" }) {
      if (startValues[field] !== values[field]) {
        dirty = true;
        break;
      }
    }
    setIsDirty(dirty);
  }, [values, startValues]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDirty) return;
    setOpenConfirm(true);
  };

  const closeConfirm = () => {
    setOpenConfirm(false);
  };

  const handleUpdate = async () => {
    const data = {};
    for (const field in { ...startValues, password: "" }) {
      if (startValues[field] !== values[field]) {
        data[field] = values[field];
      }
    }

    setIsLoading(true);
    try {
      await axios.post("/api/common/school/update", {
        idString: detail,
        school: data,
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    closeConfirm();
    setStartValues({ ...startValues, ...data });
    setIsDirty(false);
    fetchRows();
    onClose();
  };

  const [openConfirmArchive, setOpenConfirmArchive] = useState(false);

  const handleSubmitArchive = (e) => {
    e.preventDefault();
    setOpenConfirmArchive(true);
  };

  const closeConfirmArchive = () => {
    setOpenConfirmArchive(false);
  };

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/common/school/archive", {
        idString: detail,
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    closeConfirmArchive();
    onClose();
    fetchRows();
  };

  return (
    <>
      {isLoading && <Loader />}
      <DialogTitle>
        <Typography variant="h5">{detail}</Typography>
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
                helperText={errors.name}
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
              />

              <PasswordField
                sx={{ mb: 2 }}
                value={values.password || ""}
                onChange={handleChange("password")}
              />

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
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="futsal">Futsal</MenuItem>
                <MenuItem value="dance">Dance</MenuItem>
              </TextField>

              <FormGroup>
                <FormControlLabel
                  control={<Switch />}
                  label="Aktif"
                  checked={values.active || false}
                  onChange={handleChange("active", true)}
                />
                <FormControlLabel
                  control={<Switch />}
                  label="QR Code"
                  checked={values.completed || false}
                  onChange={handleChange("completed", true)}
                />
              </FormGroup>
            </Grid>

            <Grid item sm={5} xs={12}>
              <Card>
                <CardContent>
                  <TextField
                    sx={{ mb: 2 }}
                    size="small"
                    fullWidth
                    select
                    name="category"
                    label="Kategori"
                    value={startValues.category || ""}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: true }}
                  >
                    <MenuItem value="js">SMP</MenuItem>
                    <MenuItem value="hs">SMA</MenuItem>
                    <MenuItem value="univ">Universitas</MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    fullWidth
                    variant="standard"
                    name="participant"
                    label="Jumlah Peserta"
                    value={startValues.participants?.length}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: true }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}

        <DialogActions>
          <Button disabled={isLoading} onClick={handleSubmitArchive}>
            Hapus
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isDirty}
            onClick={handleSubmit}
          >
            Simpan
          </Button>
        </DialogActions>
      </form>

      <Dialog open={openConfirmArchive} onClose={closeConfirmArchive}>
        <DialogContent>
          Apakah Anda yakin ingin menghapus data ini?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmArchive}>Batal</Button>
          <Button onClick={handleArchive}>Hapus</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={closeConfirm}>
        <DialogContent>
          Apakah Anda yakin ingin menyimpan perubahan?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Batal</Button>
          <Button onClick={handleUpdate}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
