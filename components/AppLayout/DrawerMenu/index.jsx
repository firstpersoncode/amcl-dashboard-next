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
} from "@mui/material";
import { Inbox, Mail } from "@mui/icons-material";
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
                  <Mail />
                </ListItemIcon>

                <ListItemText primary="Sekolah" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/participant" passHref>
              <ListItemButton component="a">
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>

                <ListItemText primary="Peserta" />
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
                  <Inbox />
                </ListItemIcon>

                <ListItemText primary="Admin" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/logs" passHref>
              <ListItemButton component="a">
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>

                <ListItemText primary="Logs" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );
}
