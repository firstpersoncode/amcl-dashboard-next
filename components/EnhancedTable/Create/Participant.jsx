import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Close, TaskAlt } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import Uploader from "components/Uploader";
import Loader from "../Loader";
import { format } from "date-fns";

export default function Participant({ onClose, fetchRows }) {
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({});
  const [valuesSchool, setValuesSchool] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((v) => ({ ...v, [name]: undefined }));
  };

  const handleChangeSchool = (name) => (e) => {
    setValuesSchool((v) => ({ ...v, [name]: e.target.value }));
    setErrors((v) => ({ ...v, [name]: undefined }));
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenConfirm(true);
  };

  const closeConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/participant/create", {
        participant: values,
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    closeConfirm();
    fetchRows();
    onClose();
  };

  const isOfficial = values.type === "official";
  const isStudent = values.type === "student";
  const isFutsal = valuesSchool.branch === "futsal";

  const fileAvatar =
    values.files?.length && values.files.find((file) => file.type === "avatar");
  const fileLicense =
    isOfficial &&
    values.files?.length &&
    values.files.find((file) => file.type === "license");

  return (
    <>
      {isLoading && <Loader />}
      <DialogTitle>
        <Typography>Peserta</Typography>
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

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Tanggal lahir"
                  value={values.dob || ""}
                  inputFormat="dd/MM/yyyy"
                  onChange={(value) => {
                    handleChange("dob")({ target: { value } });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      sx={{ mb: 2 }}
                      size="small"
                      fullWidth
                      name="dob"
                      error={Boolean(errors.dob)}
                      helperText={errors.dob}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </LocalizationProvider>

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

              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                name="phone"
                label="No. Telephone"
                variant="standard"
                value={values.phone || ""}
                onChange={handleChange("phone")}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                sx={{ mb: 6 }}
                size="small"
                fullWidth
                name="instagram"
                label="Instagram"
                variant="standard"
                value={values.instagram || ""}
                onChange={handleChange("instagram")}
                error={Boolean(errors.instagram)}
                helperText={errors.instagram}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                select
                name="gender"
                label="Gender"
                value={values.gender || ""}
                onChange={handleChange("gender")}
                error={Boolean(errors.gender)}
                helperText={errors.gender}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="male">Pria</MenuItem>
                <MenuItem value="female">Wanita</MenuItem>
              </TextField>

              {!isOfficial && (
                <TextField
                  required
                  sx={{ mb: 2 }}
                  size="small"
                  fullWidth
                  name="studentId"
                  label="NIS/NIM"
                  variant="standard"
                  value={values.studentId || ""}
                  onChange={handleChange("studentId")}
                  error={Boolean(errors.studentId)}
                  helperText={errors.studentId}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {isStudent && (
                <TextField
                  required
                  sx={{ mb: 2 }}
                  size="small"
                  fullWidth
                  name="class"
                  label="Kelas"
                  variant="standard"
                  value={values.class || ""}
                  onChange={handleChange("class")}
                  error={Boolean(errors.class)}
                  helperText={errors.class}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {!isOfficial && isFutsal && (
                <TextField
                  required
                  sx={{ mb: 2 }}
                  size="small"
                  fullWidth
                  select
                  name="futsalPosition"
                  label="Posisi"
                  value={values.futsalPosition || ""}
                  onChange={handleChange("futsalPosition")}
                  error={Boolean(errors.futsalPosition)}
                  helperText={errors.futsalPosition}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="goal">Penjaga Gawang</MenuItem>
                  <MenuItem value="back">Pertahanan</MenuItem>
                  <MenuItem value="mid">Tengah</MenuItem>
                  <MenuItem value="forward">Penyerang</MenuItem>
                </TextField>
              )}

              {isOfficial && (
                <TextField
                  required
                  size="small"
                  fullWidth
                  select
                  name="officialPosition"
                  label="Jabatan"
                  value={values.officialPosition || ""}
                  onChange={handleChange("officialPosition")}
                  error={Boolean(errors.officialPosition)}
                  helperText={errors.officialPosition}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="coach">Pelatih</MenuItem>
                  <MenuItem value="coachAssistant">Asisten Pelatih</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="teacher">Guru</MenuItem>
                </TextField>
              )}
            </Grid>

            <Grid item sm={5} xs={12}>
              <Uploader type="avatar" value={fileAvatar} ownerId={values.id} />
              {isOfficial && (
                <Uploader
                  type="license"
                  value={fileLicense}
                  ownerId={values.id}
                />
              )}

              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <TextField
                    sx={{ mb: 2 }}
                    size="small"
                    fullWidth
                    select
                    name="school"
                    label="Sekolah"
                    value={valuesSchool.idString || ""}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChangeSchool("idString")}
                  >
                    <MenuItem value={valuesSchool.idString || ""}>
                      {valuesSchool.name}
                    </MenuItem>
                  </TextField>

                  <TextField
                    sx={{ mb: 2 }}
                    size="small"
                    fullWidth
                    select
                    name="category"
                    label="Kategori"
                    value={valuesSchool.category || ""}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChangeSchool("category")}
                  >
                    <MenuItem value="js">SMP</MenuItem>
                    <MenuItem value="hs">SMA</MenuItem>
                    <MenuItem value="univ">Universitas</MenuItem>
                  </TextField>

                  <TextField
                    sx={{ mb: 2 }}
                    size="small"
                    fullWidth
                    select
                    name="branch"
                    label="Cabang"
                    value={valuesSchool.branch || ""}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChangeSchool("branch")}
                  >
                    <MenuItem value="futsal">Futsal</MenuItem>
                    <MenuItem value="dance">Dance</MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    fullWidth
                    select
                    name="type"
                    label="Type"
                    value={values.type || ""}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChangeSchool("type")}
                  >
                    <MenuItem
                      disabled={valuesSchool.category === "univ"}
                      value="student"
                    >
                      Siswa/Siswi
                    </MenuItem>
                    <MenuItem
                      disabled={valuesSchool.category !== "univ"}
                      value="scholar"
                    >
                      Mahasiswa/Mahasiswi
                    </MenuItem>
                    <MenuItem value="official">Official</MenuItem>
                  </TextField>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogActions>
      </form>

      <Dialog open={openConfirm} onClose={closeConfirm}>
        <DialogContent>
          Apakah Anda yakin ingin menyimpan perubahan?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Batal</Button>
          <Button onClick={handleCreate}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
