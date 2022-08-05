import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import useIsMobile from "hooks/useIsMobile";
import MetaHead from "./MetaHead";
import AppBar from "./AppBar";
import DrawerMenu from "./DrawerMenu";

const drawerWidth = 240;

export default function AppLayout({ children }) {
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState(!isMobile);
  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  return (
    <>
      <MetaHead />
      <Box
        sx={{
          display: "flex",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url(/bannerr.PNG)",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            backgroundSize: "cover",
            filter: "blur(3px)",
            opacity: "0.5",
          }}
        />
        <AppBar onToggleDrawer={handleToggleDrawer} />
        <DrawerMenu
          open={openDrawer}
          onToggleDrawer={handleToggleDrawer}
          drawerWidth={drawerWidth}
        />
        <Box
          component="main"
          sx={{
            zIndex: 2,
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            marginLeft: !openDrawer && !isMobile ? `-${drawerWidth}px` : 0,
            transition: (theme) =>
              theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
}
