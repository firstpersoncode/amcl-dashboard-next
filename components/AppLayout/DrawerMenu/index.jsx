import Link from "next/link";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  LabelImportant,
  Person,
  Settings,
  QrCodeScanner,
} from "@mui/icons-material";
import useIsMobile from "hooks/useIsMobile";

export default function DrawerMenu({ open, onToggleDrawer, drawerWidth }) {
  const isMobile = useIsMobile();
  return (
    <SwipeableDrawer
      open={open}
      onOpen={onToggleDrawer}
      onClose={onToggleDrawer}
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      sx={{
        position: "relative",
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <Link href="/school" passHref>
              <ListItemButton component="a">
                <ListItemIcon>
                  <LabelImportant />
                </ListItemIcon>

                <ListItemText primary="Sekolah" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/participant" passHref>
              <ListItemButton component="a">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>

                <ListItemText primary="Peserta" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/scanned" passHref>
              <ListItemButton component="a">
                <ListItemIcon>
                  <QrCodeScanner />
                </ListItemIcon>

                <ListItemText primary="Kehadiran" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <Link href="/admin" passHref>
              <ListItemButton component="a">
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>

                <ListItemText primary="Admin" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
      <Typography
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          fontSize: "10px",
        }}
      >
        AMCL Dashboard v 0.0.1
        <Divider sx={{ my: 1 }} />
        By{" "}
        <a
          href="https://github.com/firstpersoncode"
          target="_blank"
          rel="noreferrer"
        >
          @firstpersoncode
        </a>
      </Typography>
    </SwipeableDrawer>
  );
}
