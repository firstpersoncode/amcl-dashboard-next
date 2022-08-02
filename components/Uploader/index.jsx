import { useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Loader from "./Loader";

export default function Uploader({ type, value, ownerId }) {
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
    }
  };

  const uploadToServer = async (event) => {
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
  };

  const [openDialogMessage, setOpenDialogMessage] = useState(false);

  const handleCloseDialogMessage = () => {
    setOpenDialogMessage(false);
  };

  return (
    <Card sx={{ maxWidth: 345, mb: 2 }}>
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

      {!saved && image && (
        <CardContent>
          <TextField
            fullWidth
            size="small"
            variant="standard"
            name="fileName"
            label="Name"
            value={image.name}
            InputProps={{ readOnly: true }}
          />
        </CardContent>
      )}

      {!saved && image && (
        <CardActions>
          <Button
            size="small"
            color="primary"
            type="submit"
            onClick={uploadToServer}
          >
            Save
          </Button>
        </CardActions>
      )}

      {isLoading && <Loader />}

      <Dialog open={openDialogMessage} onClose={handleCloseDialogMessage}>
        <DialogContent>
          <Typography variant="p" component="div" sx={{ textAlign: "center" }}>
            {message}
          </Typography>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
