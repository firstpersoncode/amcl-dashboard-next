import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import useForm from "./hooks/useForm";
import Loader from "./Loader";

export default function ModalLogin() {
  const {
    isLoading,
    values,
    errors,
    message,
    captcha,
    handleChange,
    handleSubmit,
    onCaptchaVerify,
    resetCaptcha,
  } = useForm();

  const [openDialogMessage, setOpenDialogMessage] = useState(false);
  useEffect(() => {
    if (message) setOpenDialogMessage(true);
  }, [message]);

  const handleCloseDialogMessage = () => {
    setOpenDialogMessage(false);
  };

  return (
    <>
      <Dialog open>
        <Card
          sx={{
            position: "relative",
          }}
        >
          {isLoading && <Loader />}
          <Box sx={{ filter: isLoading ? "blur(4px)" : undefined }}>
            <CardMedia
              component="img"
              height="80"
              image="/banner.webp"
              alt="Banner"
            />
            <form onSubmit={handleSubmit}>
              <CardContent>
                <TextField
                  autoFocus
                  fullWidth
                  name="email"
                  label="Email"
                  variant="standard"
                  value={values.email}
                  onChange={handleChange("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  variant="standard"
                  value={values.password}
                  onChange={handleChange("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              </CardContent>

              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Masuk
                </Button>
              </DialogActions>
            </form>
          </Box>
        </Card>
      </Dialog>

      <Dialog open={openDialogMessage} onClose={handleCloseDialogMessage}>
        <DialogContent>
          <Typography variant="p" component="div" sx={{ textAlign: "center" }}>
            {message}
          </Typography>
        </DialogContent>
      </Dialog>

      <HCaptcha
        ref={captcha}
        size="invisible"
        sitekey={process.env.HCAPTCHA_SITE_KEY}
        onVerify={onCaptchaVerify}
        onError={resetCaptcha}
        onClose={resetCaptcha}
        onChalExpired={resetCaptcha}
      />
    </>
  );
}
