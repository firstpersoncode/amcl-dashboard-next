import { useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Cameraswitch, ChangeCircle } from "@mui/icons-material";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import Loader from "./Loader";
import Participant from "./Participant";
import useIsMobile from "hooks/useIsMobile";

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
  const [qrcodeDetail, setQRCodeDetail] = useState({});
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const toggleOpenMessage = () => {
    setOpenMessage(!openMessage);
  };
  const scanQRDetail = async (idString) => {
    setMessage("");
    try {
      const res = await axios.post("/api/qrcode/scan", { idString });

      if (res.data) {
        setQRCodeDetail(res.data);
        toggleQRCodeDetail();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setMessage(err.response.data);
        setOpenMessage(true);
      }
    }
  };

  const handleQRScan = (result, error) => {
    if (processing) return;

    if (result) {
      setProcessing(true);
      const idString = result.text;
      scanQRDetail(idString);
    }

    if (error) {
      console.info(error);
    }
  };

  const [qrText, setQRText] = useState("");
  const handleQRTextChange = (e) => {
    setQRText(e.target.value);
  };
  const handleQRTextSubmit = (e) => {
    e.preventDefault();
    scanQRDetail(qrText);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const isMobile = useIsMobile();

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
          <ChangeCircle />
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
            onResult={handleQRScan}
            constraints={{ facingMode }}
            videoContainerStyle={{
              width: "100vw",
            }}
          />
        </Box>
      ) : (
        <Box sx={{ padding: 4 }}>
          <form onSubmit={handleQRTextSubmit}>
            <TextField
              variant="standard"
              name="qrcode"
              label="QR Code"
              fullWidth
              value={qrText}
              onChange={handleQRTextChange}
            />
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                onClick={handleQRTextSubmit}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      )}

      <Dialog
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        open={openQRCodeDetail}
        onClose={() => {
          setProcessing(false);
          toggleQRCodeDetail();
        }}
      >
        <Participant
          participant={qrcodeDetail.owner}
          onClose={() => {
            setProcessing(false);
            toggleQRCodeDetail();
          }}
        />
      </Dialog>

      <Dialog open={openMessage} onClose={toggleOpenMessage}>
        <DialogContent>{message}</DialogContent>
      </Dialog>

      {processing && <Loader />}
    </Dialog>
  );
}
