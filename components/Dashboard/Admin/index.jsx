import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button } from "@mui/material";

const QRScanner = dynamic(() => import("components/QRScanner"), { ssr: false });

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
      <QRScanner open={openQRScanner} onClose={handleCloseQRScanner} />
    </Box>
  );
}
