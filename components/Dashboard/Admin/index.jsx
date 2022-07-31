import { useState } from "react";
import { Box, Button } from "@mui/material";
// import QRScanner from "components/QRScanner";

export default function Admin() {
  const [openQRScanner, setOpenQRScanner] = useState(false);
  const handleOpenQRScanner = () => {
    setOpenQRScanner(true);
  };

  const handleCloseQRScanner = () => {
    setOpenQRScanner(false);
  };
  return (
    <Box>
      <Button onClick={handleOpenQRScanner}>Scanner</Button>
      {/* <QRScanner open={openQRScanner} onClose={handleCloseQRScanner} /> */}
    </Box>
  );
}
