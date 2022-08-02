import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
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
import axios from "axios";
import Uploader from "components/Uploader";
import Loader from "../Loader";

export default function Scanned({ detail, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const [owner, setOwner] = useState({});
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/qrcode/read", {
          idString: detail,
        });
        if (res?.data) {
          setOwner(res.data.owner);
        } else setOwner({});
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [detail]);

  const isOfficial = owner.type === "official";
  const isStudent = owner.type === "student";
  const isFutsal = owner.school?.branch === "futsal";

  const fileAvatar =
    owner.files?.length && owner.files.find((file) => file.type === "avatar");
  const fileLicense =
    isOfficial &&
    owner.files?.length &&
    owner.files.find((file) => file.type === "license");

  return (
    <>
      {isLoading && <Loader />}
      <DialogTitle>
        <Typography variant="h5">{owner.idString}</Typography>
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
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item sm={7} xs={12}>
            <TextField
              sx={{ mb: 2, pointerEvents: "none" }}
              size="small"
              fullWidth
              name="name"
              label="Nama"
              variant="standard"
              value={owner.name || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Tanggal lahir"
                value={owner.dob || ""}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ mb: 2, pointerEvents: "none" }}
                    size="small"
                    fullWidth
                    name="dob"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              sx={{ mb: 2, pointerEvents: "none" }}
              size="small"
              fullWidth
              name="email"
              label="Email"
              variant="standard"
              value={owner.email || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
            />

            <TextField
              sx={{ mb: 2, pointerEvents: "none" }}
              size="small"
              fullWidth
              name="phone"
              label="No. Telephone"
              variant="standard"
              value={owner.phone || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
            />

            <TextField
              sx={{ mb: 6, pointerEvents: "none" }}
              size="small"
              fullWidth
              name="instagram"
              label="Instagram"
              variant="standard"
              value={owner.instagram || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
            />

            <TextField
              sx={{ mb: 2, pointerEvents: "none" }}
              size="small"
              fullWidth
              select
              name="gender"
              label="Gender"
              value={owner.gender || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
            >
              <MenuItem value="male">Pria</MenuItem>
              <MenuItem value="female">Wanita</MenuItem>
            </TextField>

            {!isOfficial && (
              <TextField
                sx={{ mb: 2, pointerEvents: "none" }}
                size="small"
                fullWidth
                name="studentId"
                label="NIS/NIM"
                variant="standard"
                value={owner.studentId || ""}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: true }}
              />
            )}

            {isStudent && (
              <TextField
                sx={{ mb: 2, pointerEvents: "none" }}
                size="small"
                fullWidth
                name="class"
                label="Kelas"
                variant="standard"
                value={owner.class || ""}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: true }}
              />
            )}

            {!isOfficial && isFutsal && (
              <TextField
                sx={{ mb: 2, pointerEvents: "none" }}
                size="small"
                fullWidth
                select
                name="futsalPosition"
                label="Posisi"
                value={owner.futsalPosition || ""}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: true }}
              >
                <MenuItem value="goal">Penjaga Gawang</MenuItem>
                <MenuItem value="back">Pertahanan</MenuItem>
                <MenuItem value="mid">Tengah</MenuItem>
                <MenuItem value="forward">Penyerang</MenuItem>
              </TextField>
            )}

            {isOfficial && (
              <TextField
                sx={{ pointerEvents: "none" }}
                size="small"
                fullWidth
                select
                name="officialPosition"
                label="Jabatan"
                value={owner.officialPosition || ""}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: true }}
              >
                <MenuItem value="coach">Pelatih</MenuItem>
                <MenuItem value="coachAssistant">Asisten Pelatih</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="teacher">Guru</MenuItem>
              </TextField>
            )}
          </Grid>

          <Grid item sm={5} xs={12}>
            <Box sx={{ pointerEvents: "none" }}>
              <Uploader type="avatar" value={fileAvatar} ownerId={owner.id} />
              {isOfficial && (
                <Uploader
                  type="license"
                  value={fileLicense}
                  ownerId={owner.id}
                />
              )}
            </Box>

            <Card sx={{ mt: 4 }}>
              <CardContent>
                <TextField
                  sx={{ mb: 2, pointerEvents: "none" }}
                  size="small"
                  fullWidth
                  select
                  name="school"
                  label="Sekolah"
                  value={owner.school?.idString || ""}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ readOnly: true }}
                >
                  <MenuItem value={owner.school?.idString || ""}>
                    {owner.school?.name}
                  </MenuItem>
                </TextField>

                <TextField
                  sx={{ mb: 2, pointerEvents: "none" }}
                  size="small"
                  fullWidth
                  select
                  name="category"
                  label="Kategori"
                  value={owner.school?.category || ""}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ readOnly: true }}
                >
                  <MenuItem value="js">SMP</MenuItem>
                  <MenuItem value="hs">SMA</MenuItem>
                  <MenuItem value="univ">Universitas</MenuItem>
                </TextField>

                <TextField
                  sx={{ mb: 2, pointerEvents: "none" }}
                  size="small"
                  fullWidth
                  select
                  name="branch"
                  label="Cabang"
                  value={owner.school?.branch || ""}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ readOnly: true }}
                >
                  <MenuItem value="futsal">Futsal</MenuItem>
                  <MenuItem value="dance">Dance</MenuItem>
                </TextField>

                <TextField
                  sx={{ pointerEvents: "none" }}
                  size="small"
                  fullWidth
                  select
                  name="type"
                  label="Type"
                  value={owner.type || ""}
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
    </>
  );
}
