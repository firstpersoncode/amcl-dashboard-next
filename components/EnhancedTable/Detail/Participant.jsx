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
import { Close } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import Uploader from "components/Uploader";
import Loader from "../Loader";

export default function Participant({ detail, onClose, fetchRows }) {
  const [isLoading, setIsLoading] = useState(false);
  const [startValues, setStartValues] = useState({});
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const [valuesSchool, setValuesSchool] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/participant/read", { id: detail });
        if (res?.data) {
          setStartValues(res.data);
          setValues(res.data);
        }
        if (res?.data.school) setValuesSchool(res.data.school);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [detail]);

  const handleChange = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((v) => ({ ...v, [name]: undefined }));
  };

  useEffect(() => {
    let dirty = false;
    for (const field in startValues) {
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
    for (const field in startValues) {
      if (startValues[field] !== values[field]) {
        data[field] = values[field];
      }
    }

    setIsLoading(true);
    try {
      await axios.post("/api/participant/update", {
        id: detail,
        participant: data,
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    closeConfirm();
    setStartValues({ ...startValues, ...data });
    setIsDirty(false);
    fetchRows();
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
      await axios.post("/api/participant/archive", {
        id: detail,
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    closeConfirmArchive();
    onClose();
    fetchRows();
  };

  const isOfficial = startValues.type === "official";
  const isStudent = startValues.type === "student";
  const isFutsal = valuesSchool.branch === "futsal";

  const fileAvatar =
    values.files?.length && values.files.find((file) => file.type === "avatar");
  const fileLicense =
    isOfficial &&
    values.files?.length &&
    values.files.find((file) => file.type === "license");

  const [openQRCode, setOpenQRCode] = useState(false);
  const toggleQRCode = () => {
    setOpenQRCode(!openQRCode);
  };

  return (
    <>
      {isLoading && <Loader />}
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h3">{startValues.name}</Typography>
            <Typography fontSize="small">{startValues.idString}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {startValues.qrcode?.idString && (
              <Button size="small" variant="contained" onClick={toggleQRCode}>
                QR Code
              </Button>
            )}
            {startValues.qrcode?.scannedAt}
          </Box>
        </Box>
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
              <Uploader type="avatar" value={fileAvatar} ownerId={detail} />
              {isOfficial && (
                <Uploader type="license" value={fileLicense} ownerId={detail} />
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
                    value={valuesSchool.id || ""}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: true }}
                  >
                    <MenuItem value={valuesSchool.id || ""}>
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
                    inputProps={{ readOnly: true }}
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
                    inputProps={{ readOnly: true }}
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
                    value={startValues.type || ""}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: true }}
                  >
                    <MenuItem value="student">Siswa/Siswi</MenuItem>
                    <MenuItem value="scholar">Mahasiswa/Mahasiswi</MenuItem>
                    <MenuItem value="official">Official</MenuItem>
                  </TextField>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

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

      {startValues.qrcode?.idString && (
        <Dialog open={openQRCode} onClose={toggleQRCode}>
          <DialogContent sx={{ backgroundColor: "#FFF" }}>
            <QRCodeSVG value={startValues.qrcode.idString} />
          </DialogContent>
        </Dialog>
      )}

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
