import { HelpCircle } from "lucide-react";
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
} from "@mui/material";
import { LogOut as LogOutIcon } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex justify-between items-center rounded-xl mx-auto p-2 shadow-md">
      <header className="bg-white p-4">
        <h1 className="text-2xl font-bold">Sistem Monitoring Curah Hujan</h1>
        <p className="text-sm">Pantau data curah hujan secara real-time</p>
      </header>

      <div className="flex gap-2">
        <Button variant="outlined" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> Bantuan
        </Button>

        {/* Profil dengan dropdown */}
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
              setOpenDialog(true);
            }}
          >
            <LogOutIcon size={18} style={{ marginRight: 8 }} /> Logout
          </MenuItem>
        </Menu>
      </div>

      {/* Dialog Logout */}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
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
            onClick={() => setOpenDialog(false)}
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
