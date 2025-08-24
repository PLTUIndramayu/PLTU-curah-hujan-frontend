import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Box,
  TablePagination,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { AlertTriangle } from "lucide-react";

export function HeadTableViewData() {
  return (
    <>
      <TableHead sx={{ width: "100%" }}>
        <TableRow>
          <TableCell>Nama</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Kode User</TableCell>
          <TableCell>Email</TableCell>
          {/* <TableCell>Nomor Telepon</TableCell> */}
          <TableCell>Kode Stasiun</TableCell>
          <TableCell>Dibuat pada</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
    </>
  );
}

export function BodyTableViewData({ rows }) {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    role: "",
    email: "",
    nomor_telepon: "",
    kode_stasiun: "",
    password: "",
    confirm_password: "",
    createdAt: "",
    updatedAt: "",
    jabatan: "",
    kode_user: "",
    tgl_mulai_bekerja: "",
    alamat: "",
    foto_profil: null,
    tanggal_lahir: "",
  });
  const handleOpenModal = (id) => {
    const selectedData = rows.find((item) => item.id === id);
    if (selectedData) {
      setForm({
        nama: selectedData.nama || "",
        role: selectedData.role || "",
        email: selectedData.email || "",
        nomor_telepon: selectedData.nomor_telepon || "",
        kode_stasiun: selectedData.kode_stasiun || "",
        kode_user: selectedData.kode_user || "",
        tgl_mulai_bekerja: selectedData.tgl_mulai_bekerja || "",
        alamat: selectedData.alamat || "",
        jabatan: selectedData.jabatan || "",
        foto_profil: selectedData.foto || null,
        tanggal_lahir: selectedData.tanggal_lahir || "",
        password: "",
        confirm_password: "",
        createdAt: selectedData.createdAt || "",
        updatedAt: selectedData.updatedAt || "",
      });
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Akun berhasil dihapus");
      window.location.reload();

      if (!res.ok) throw new Error("Gagal menghapus akun");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus akun");
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenDialog = (id) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  return (
    <>
      <TableBody>
        {Array.isArray(rows) && rows.length > 0 ? (
          rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: 200 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      src={item?.foto_profil}
                    />
                    <span>{item.nama || "-"}</span>
                  </Box>
                </TableCell>

                <TableCell>{item.role || "-"}</TableCell>
                <TableCell>{item.kode_user || "-"}</TableCell>
                <TableCell>{item.email || "-"}</TableCell>
                {/* <TableCell>{item.nomor_telepon || "-"}</TableCell> */}
                <TableCell>{item.kode_stasiun || "-"}</TableCell>
                <TableCell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        ,
                        <path d="M12 6.5C7 6.5 2.73 9.61 1 12c1.73 2.39 6 5.5 11 5.5s9.27-3.11 11-5.5c-1.73-2.39-6-5.5-11-5.5zm0 9c-2.48 0-4.5-2.02-4.5-4.5S9.52 6.5 12 6.5s4.5 2.02 4.5 4.5S14.48 15.5 12 15.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S13.38 8.5 12 8.5z" />
                      </svg>
                    }
                    sx={{ textTransform: "none" }}
                    onClick={() => handleOpenModal(item.id)}
                  >
                    Lihat
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    sx={{ textTransform: "none" }}
                    color="error"
                    onClick={handleOpenDialog.bind(this, item.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              Tidak ada data
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Baris per halaman"
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 800,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Detail User
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}>
            <Typography>
              <strong>Nama:</strong> {form.nama || "-"}
            </Typography>
            <Typography>
              <strong>Role:</strong> {form.role || "-"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {form.email || "-"}
            </Typography>
            <Typography>
              <strong>Alamat:</strong> {form.alamat || "-"}
            </Typography>
            <Typography>
              <strong>Nomor Telepon:</strong> {form.nomor_telepon || "-"}
            </Typography>
            <Typography>
              <strong>Kode User:</strong> {form.kode_user || "-"}
            </Typography>
            <Typography>
              <strong>Kode Stasiun:</strong> {form.kode_stasiun || "-"}
            </Typography>
            <Typography>
              <strong>Tanggal Mulai Bekerja:</strong>{" "}
              {form.tgl_mulai_bekerja
                ? new Date(form.tgl_mulai_bekerja).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
            <Typography>
              <strong>Dibuat pada:</strong>{" "}
              {form.createdAt
                ? new Date(form.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
            <Typography>
              <strong>Terakhir diupdate pada:</strong>{" "}
              {form.updatedAt
                ? new Date(form.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
          </Box>
          <br />
        </Box>
      </Modal>

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
            Konfirmasi Hapus Akun
          </DialogTitle>
        </Box>

        <DialogContent>
          <Typography variant="body1" textAlign="center">
            Apakah Anda yakin ingin menghapus akun ini?
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
            onClick={() => {
              handleDelete(selectedUserId);
              setOpenDialog(false);}}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
