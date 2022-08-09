import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu, Logout } from "@mui/icons-material";
import axios from "axios";
import Loader from "./Loader";
import Image from "next/image";
import useIsMobile from "hooks/useIsMobile";

export default function AppBar({ onToggleDrawer }) {
  const isMobile = useIsMobile();
  const { replace } = useRouter();
  const handleLogout = async () => {
    await axios.get("/api/common/logout");
    replace("/login");
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onToggleDrawer} sx={{ mr: 2 }}>
          <Menu />
        </IconButton>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <Link href="/">
            <a>
              <Image width={30} height={40} src="/logo-md.png" alt="Logo" />
            </a>
          </Link>

          {!isMobile && (
            <Link href="/" passHref>
              <a>
                <Typography variant="h5">Makassar Champion League</Typography>
              </a>
            </Link>
          )}
        </Box>

        <IconButton size="small" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </Toolbar>
      <Loader />
    </MuiAppBar>
  );
}
