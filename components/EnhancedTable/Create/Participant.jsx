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
import Uploader from "components/Uploader";
import Loader from "../Loader";
import generateUID from "./utils/generateUID";

export default function Participant({ onClose, fetchRows }) {
  const [isLoading, setIsLoading] = useState(false);

  const [schoolOptions, setSchoolOptions] = useState([]);
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

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
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

  const fileAvatar =
    values.files?.length && values.files.find((file) => file.type === "avatar");
  const fileLicense =
    isOfficial &&
    values.files?.length &&
    values.files.find((file) => file.type === "license");

  const [avatar, setAvatar] = useState(fileAvatar);
  const [license, setLicense] = useState(fileLicense);
  const [submitAvatar, setSubmitAvatar] = useState(false);
  const [submitLicense, setSubmitLicense] = useState(false);

  const handleChangeAvatar = ({ image }) => {
    setAvatar(image);
  };

  const handleChangeLicense = ({ image }) => {
    setLicense(image);
  };

  const onFinishUploadAvatar = useCallback(() => {
    setSubmitAvatar(false);
  }, []);

  const onFinishUploadLicense = useCallback(() => {
    setSubmitLicense(false);
  }, []);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const selectedSchool = schoolOptions.find(
        (s) => s.id === values.schoolId
      );
      const res = await axios.post("/api/participant/create", {
        participant: {
          ...values,
          idString: generateUID(),
          schoolId: selectedSchool.id,
          active: true,
          archived: false,
        },
      });

      if (res.data?.id) {
        setValues((v) => ({ ...v, id: res.data.id }));
        if (avatar) setSubmitAvatar(true);
        if (license) setSubmitLicense(true);
      }
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
                value={fileAvatar}
                ownerId={values.id}
                submit={submitAvatar}
                onChange={handleChangeAvatar}
                onUpload={onFinishUploadAvatar}
              />
              {isOfficial && (
                <Uploader
                  label="Foto License"
                  type="license"
                  value={fileLicense}
                  ownerId={values.id}
                  submit={submitLicense}
                  onChange={handleChangeLicense}
                  onUpload={onFinishUploadLicense}
                />
              )}

              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <TextField
                    size="small"
                    fullWidth
                    select
                    name="schoolId"
                    label="Sekolah"
                    value={values.schoolId || ""}
                    onChange={handleChange("schoolId")}
                  >
                    {schoolOptions
                      .map((school) => ({
                        value: school.id,
                        label: school.name,
                      }))
                      .map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </TextField>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogContent>
          <pre>{JSON.stringify(values, null, 4)}</pre>
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
    </>
  );
}
