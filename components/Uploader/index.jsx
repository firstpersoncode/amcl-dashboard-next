import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogContent,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Upload } from "@mui/icons-material";
import axios from "axios";
import Loader from "./Loader";

export default function Uploader({
  label,
  type,
  value,
  ownerId,
  onChange,
  onUpload,
  submit,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setSaved(false);
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));

      onChange({ image: i, objectImage: URL.createObjectURL(i) });
    }
  };

  const uploadToServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const body = new FormData();
      body.append("file", image);
      body.append("type", type);
      body.append("ownerId", ownerId);
      await axios.post("/api/upload", body);
      setSaved(true);
    } catch (err) {
      if (err.response?.data) setMessage(err.response.data);
      setOpenDialogMessage(true);
      console.error(err);
    }
    setIsLoading(false);
    onUpload();
  }, [image, type, ownerId, onUpload]);

  const [openDialogMessage, setOpenDialogMessage] = useState(false);

  const handleCloseDialogMessage = () => {
    setOpenDialogMessage(false);
  };

  useEffect(() => {
    (async () => {
      if (submit) await uploadToServer();
    })();
  }, [submit, uploadToServer]);

  return (
    <>
      <Typography sx={{ mb: 1 }}>{label}</Typography>

      <Card sx={{ mb: 2 }}>
        {createObjectURL || value?.url ? (
          <CardActionArea component="label">
            <CardMedia
              component="img"
              height="300"
              image={createObjectURL || value?.url}
              alt={image?.name || value?.name}
            />

            <input
              hidden
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadToClient}
            />
          </CardActionArea>
        ) : (
          <Button fullWidth variant="contained" component="label">
            <Upload />
            Tambahkan file
            <input
              hidden
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadToClient}
            />
          </Button>
        )}

        {isLoading && <Loader />}

        <Dialog open={openDialogMessage} onClose={handleCloseDialogMessage}>
          <DialogContent>
            <Typography
              variant="p"
              component="div"
              sx={{ textAlign: "center" }}
            >
              {message}
            </Typography>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
