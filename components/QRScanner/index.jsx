import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Cameraswitch, Input, CenterFocusStrong } from "@mui/icons-material";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import Loader from "./Loader";

export default function QRScanner({ open, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  const stopScanner = () => {
    try {
      const video = document.getElementById("qrScanner");
      const mediaStream = video.srcObject;
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleToggleFacingMode = () => {
    setFacingMode((v) => (v === "user" ? "environment" : "user"));
  };

  const [inputMode, setInputMode] = useState("scan");

  const handleToggleInputMode = () => {
    setInputMode((v) => {
      const isScanner = v === "scan";
      if (isScanner) stopScanner();
      return isScanner ? "text" : "scan";
    });
  };

  const [openQRCodeDetail, setOpenQRCodeDetail] = useState(false);
  const toggleQRCodeDetail = () => {
    setOpenQRCodeDetail(!openQRCodeDetail);
  };
  const [qrcodeDetail, setQRCodeDetail] = useState();

  const fetchQRDetail = async (idString) => {
    setProcessing(true);
    try {
      const res = await axios.post("/api/qrcode/read", { idString });
      setQRCodeDetail(res.data);
      toggleQRCodeDetail();
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const handleQrScan = (result, error) => {
    if (processing) return;

    if (result) {
      const idString = result.text;
      fetchQRDetail(idString);
    }

    if (error) {
      console.info(error);
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "flex-end",
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 2,
        }}
      >
        <IconButton onClick={handleToggleInputMode}>
          {inputMode === "scan" ? <Input /> : <CenterFocusStrong />}
        </IconButton>
        <IconButton
          disabled={inputMode !== "scan"}
          onClick={handleToggleFacingMode}
        >
          <Cameraswitch />
        </IconButton>
      </Stack>

      {inputMode === "scan" ? (
        <Box
          sx={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <QrReader
            key={facingMode}
            videoId="qrScanner"
            scanDelay={500}
            onResult={handleQrScan}
            constraints={{ facingMode }}
            videoContainerStyle={{
              width: "100vw",
            }}
          />
        </Box>
      ) : (
        <Box sx={{ padding: 4 }}>
          <TextField
            variant="standard"
            name="qrcode"
            label="QR Code"
            fullWidth
          />
        </Box>
      )}

      <Dialog open={openQRCodeDetail} onClose={toggleQRCodeDetail}>
        <DialogContent>
          <pre>{JSON.stringify(qrcodeDetail, null, 4)}</pre>
        </DialogContent>
      </Dialog>

      {processing && <Loader />}
    </Dialog>
  );
}
