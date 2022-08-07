import { useCallback, useEffect, useState } from "react";
import {
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
import axios from "axios";
import generateUID from "utils/generateUID";
import Uploader from "components/Uploader";
import AutocompleteField from "components/AutoCompleteField";
import Loader from "../Loader";

export default function Participant({ onClose, fetchRows }) {
  const [isLoading, setIsLoading] = useState(false);

  const [schoolOptions, setSchoolOptions] = useState([]);
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

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");
  const [openDialogMessage, setOpenDialogMessage] = useState(false);

  const toggleMessage = () => {
    setOpenDialogMessage(!openDialogMessage);
  };

  const handleChange = (name) => (e) => {
    const target = name === "schoolId" ? e.target.value : e.target;
    setValues((v) => ({ ...v, [name]: target?.value }));
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

  const isOfficial = values.type === "official";
  const isParticipant = values.type === "participant";
  const isFutsal =
    schoolOptions.find((s) => s.id === values.schoolId)?.branch === "futsal";
  const isUniv =
    schoolOptions.find((s) => s.id === values.schoolId)?.category === "univ";

  const [avatar, setAvatar] = useState();
  const [license, setLicense] = useState();

  const handleChangeAvatar = ({ image }) => {
    setAvatar(image);
  };

  const handleChangeLicense = ({ image }) => {
    setLicense(image);
  };

  const uploadAvatarToServer = (ownerId) => {
    const body = new FormData();
    body.append("file", avatar);
    body.append("type", "avatar");
    body.append("ownerId", ownerId);
    return axios.post("/api/common/upload?e=admin", body);
  };

  const uploadLicenseToServer = (ownerId) => {
    const body = new FormData();
    body.append("file", license);
    body.append("type", "license");
    body.append("ownerId", ownerId);
    return axios.post("/api/common/upload?e=admin", body);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const selectedSchool = schoolOptions.find(
        (s) => s.id === values.schoolId
      );
      const res = await axios.post("/api/common/participant/create?e=admin", {
        participant: {
          ...values,
          idString: `${selectedSchool?.idString}-${generateUID()}`,
          schoolId: selectedSchool.id,
          active: true,
          archived: false,
        },
      });

      if (res.data?.id) {
        if (avatar) await uploadAvatarToServer(res.data.id);
        if (license) await uploadLicenseToServer(res.data.id);
      }
    } catch (err) {
      if (err.response?.data) {
        setMessage(err.response.data);
        toggleMessage();
      }
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
              >
                <MenuItem value="male">Pria</MenuItem>
                <MenuItem value="female">Wanita</MenuItem>
              </TextField>

              <TextField
                required
                sx={{ mb: 2 }}
                size="small"
                fullWidth
                select
                name="type"
                label="Type"
                value={values.type || ""}
                onChange={handleChange("type")}
                error={Boolean(errors.type)}
                helperText={errors.type}
              >
                <MenuItem value="participant">Peserta</MenuItem>
                <MenuItem value="official">Official</MenuItem>
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
                />
              )}

              {!isUniv && isParticipant && (
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
                >
                  <MenuItem value="coach">Pelatih</MenuItem>
                  <MenuItem value="coachAssistant">Asisten Pelatih</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="teacher">Guru</MenuItem>
                </TextField>
              )}
            </Grid>

            <Grid item sm={5} xs={12}>
              <Uploader
                label="Foto Profile"
                type="avatar"
                value={avatar}
                onChange={handleChangeAvatar}
              />
              {isOfficial && (
                <Uploader
                  label="Foto License"
                  type="license"
                  value={license}
                  onChange={handleChangeLicense}
                />
              )}

              <AutocompleteField
                label="Sekolah"
                value={values.schoolId || ""}
                onChange={handleChange("schoolId")}
                options={schoolOptions.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
              />
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
          Apakah Anda yakin ingin membuat peserta baru?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Batal</Button>
          <Button onClick={handleCreate}>Simpan</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogMessage} onClose={toggleMessage}>
        <DialogContent>
          <Typography variant="p" component="div" sx={{ textAlign: "center" }}>
            {message}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
