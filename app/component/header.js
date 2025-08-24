import {
  HelpCircle,
  HomeIcon,
  ListIcon,
  LogOut as LogOutIcon,
  PencilIcon,
  User as UserIcon,
} from "lucide-react";
import { AlertTriangle } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "../api/user";

export function Header() {
  const [openDialogLogout, setOpenDialogLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const data = useProfile();

  return (
    <div
      className="bg-white shadow-md rounded-xl mx-auto p-2 flex items-center justify-between"
      style={{
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 12 : 0,
        padding: isMobile ? "8px" : "16px",
      }}
    >
      <header
        className="p-2"
        style={{
          width: isMobile ? "100%" : "auto",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: isMobile ? "1.2rem" : "2rem",
          }}
        >
          Sistem Monitoring Curah Hujan
        </h1>
        <p
          className="text-sm"
          style={{
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Pantau data curah hujan secara real-time
        </p>
      </header>

      {isMobile ? (
        <>
          <IconButton
            edge="end"
            color="primary"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ ml: "auto" }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
            <Box sx={{ width: 220 }}>
              <List>
                <ListItem
                  button
                  onClick={() => {
                    setDrawerOpen(false);
                    router.push("/dashboard");
                  }}
                >
                  <ListItemIcon>
                    <HomeIcon size={18} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  href="https://www.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <HelpCircle className="w-4 h-4" />
                  </ListItemIcon>
                  <ListItemText primary="Bantuan" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    setDrawerOpen(false);
                    router.push("/profile");
                  }}
                >
                  <ListItemIcon>
                    <UserIcon size={18} />
                  </ListItemIcon>
                  <ListItemText primary="Profil Saya" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    setDrawerOpen(false);
                    setOpenDialogLogout(true);
                  }}
                >
                  <ListItemIcon>
                    <LogOutIcon size={18} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </>
      ) : (
        <div className="flex gap-2">
          <Link href="https://www.whatsapp.com" passHref>
            <Button
              variant="outlined"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Bantuan
            </Button>
          </Link>
          <Button variant="outlined" onClick={handleMenuOpen}>
            Profil
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push("/dashboard");
              }}
            >
              <HomeIcon size={18} style={{ marginRight: 8 }} />
              Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push("/profile");
              }}
            >
              <UserIcon size={18} style={{ marginRight: 8 }} />
              Profil Saya
            </MenuItem>

            {data?.role === "admin" && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  router.push("/register");
                }}
              >
                <PencilIcon size={18} style={{ marginRight: 8 }} />
                Buat Akun Baru
              </MenuItem>
            )}

            {data?.role === "admin" && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  router.push("/view-list-user");
                }}
              >
                <ListIcon size={18} style={{ marginRight: 8 }} />
                Lihat Daftar User
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                handleMenuClose();
                setOpenDialogLogout(true);
              }}
            >
              <LogOutIcon size={18} style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      )}

      {/* Dialog Logout */}
      <Dialog
        open={openDialogLogout}
        onClose={() => setOpenDialogLogout(false)}
        PaperProps={{
          sx: { borderRadius: 3, padding: 1, minWidth: 350 },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <AlertTriangle size={40} color="#f44336" />
          <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}>
            Konfirmasi Logout
          </DialogTitle>
        </Box>

        <DialogContent>
          <Typography variant="body1" textAlign="center">
            Apakah Anda yakin ingin keluar dari akun ini?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button
            onClick={() => setOpenDialogLogout(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Batal
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
