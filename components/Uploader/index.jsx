import { useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function Uploader({ type, value, ownerId }) {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", image);
    body.append("type", type);
    body.append("ownerId", ownerId);
    await axios.post("/api/upload", body);
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

      {image && (
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

      {image && (
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
    </Card>
  );
}
