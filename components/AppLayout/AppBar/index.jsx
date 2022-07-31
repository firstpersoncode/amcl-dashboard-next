import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppBar as MuiAppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import axios from "axios";
import Loader from "./Loader";

export default function AppBar({ onToggleDrawer }) {
  const { replace } = useRouter();
  const handleLogout = async () => {
    await axios.get("/api/admin/logout");
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

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref>
            <a>Makassar Champion League</a>
          </Link>
        </Typography>

        <Button size="small" onClick={handleLogout}>
          Keluar
        </Button>
      </Toolbar>
      <Loader />
    </MuiAppBar>
  );
}
