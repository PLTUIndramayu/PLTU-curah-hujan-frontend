import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Box,
  Table,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormInputData } from "../input-data/page";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetCurahHujanById, useUpdateCurahHujan } from "../api/curah-hujan";

export function HeadTableViewData() {
  return (
    <>
      <TableHead sx={{ width: "100%" }}>
        <TableRow>
          <TableCell>Tanggal</TableCell>
          <TableCell>Jam</TableCell>
          <TableCell>Umur HSS</TableCell>
          <TableCell>Umur Tanaman</TableCell>
          <TableCell>Curah Hujan (mm)</TableCell>
          <TableCell>Sifat Hujan</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
    </>
  );
}

export function BodyTableViewData({ rows }) {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    tanggal: "",
    jam: "",
    umur_hss: "",
    umur_tanaman: "",
    curah_hujan: "",
    sifat_hujan: "",
    varietas: "",
    sumber_air: "",
    opt: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedId, setSelectedId] = useState(null);

  const dataById = useGetCurahHujanById(selectedId);

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const { updateCurahHujan } = useUpdateCurahHujan();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateCurahHujan(selectedId, form);
      alert("Data berhasil diupdate");
      setOpenModal(false);
      window.location.reload();
    } catch (err) {
      alert("Gagal update: " + err.message);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/curah-hujan/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Data berhasil dihapus");

      if (!res.ok) throw new Error("Gagal menghapus data");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  useEffect(() => {
    if (openModal && dataById) {
      setForm({
        ...dataById,
        tanggal: dataById.tanggal
          ? new Date(dataById.tanggal).toISOString().split("T")[0]
          : "",
      });
    }
  }, [dataById, openModal]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableBody>
        {Array.isArray(rows) && rows.length > 0 ? (
          rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.tanggal
                    ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </TableCell>
                <TableCell>
                  {item.jam
                    ? new Date(`1970-01-01T${item.jam}`).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}
                </TableCell>
                <TableCell>{item.umur_hss} hari</TableCell>
                <TableCell>{item.umur_tanaman} hari</TableCell>
                <TableCell>{item.curah_hujan}</TableCell>
                <TableCell>{item.sifat_hujan}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={() => handleOpenModal(item.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    sx={{ textTransform: "none" }}
                    color="error"
                    onClick={() => handleDelete(item.id)}
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

      <>
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
      </>
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
          <FormInputData
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Modal>
    </>
  );
}
