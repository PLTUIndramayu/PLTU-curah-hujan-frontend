import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Box,
  Table,
  TextField,
  TablePagination,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetCurahHujanById, useUpdateCurahHujan } from "../api/curah-hujan";

function FormInputData({ handleSubmit, form, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">Input Data Curah Hujan</h2>
      <p className="text-sm text-gray-600 mb-6">
        Formulir pencatatan data harian curah hujan
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="flex flex-col gap-1">
          <Typography>Hari/Tanggal</Typography>
          <TextField
            type="date"
            name="tanggal"
            className="p-2 border rounded"
            value={form.tanggal}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Jam</Typography>
          <TextField
            type="time"
            name="jam"
            className="p-2 border rounded"
            value={form.jam}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Umur HSS (Hari Setelah Semai)</Typography>
          <TextField
            type="number"
            name="umur_hss"
            className="p-2 border rounded"
            value={form.umur_hss}
            onChange={handleChange}
            placeholder="Masukkan umur HSS"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Umur Tanaman (Hari Setelah Tanam)</Typography>
          <TextField
            type="number"
            name="umur_tanaman"
            className="p-2 border rounded"
            value={form.umur_tanaman}
            onChange={handleChange}
            placeholder="Masukkan umur tanaman"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Curah Hujan (mm)</Typography>
          <TextField
            type="number"
            name="curah_hujan"
            className="p-2 border rounded"
            value={form.curah_hujan}
            onChange={handleChange}
            placeholder="Masukkan curah hujan"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Sifat Hujan</Typography>
          <TextField
            type="text"
            name="sifat_hujan"
            className="p-2 border rounded bg-gray-100"
            value={form.sifat_hujan}
            readOnly
            placeholder="Terisi otomatis"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Varietas</Typography>
          <TextField
            type="text"
            name="varietas"
            className="p-2 border rounded"
            value={form.varietas}
            onChange={handleChange}
            placeholder="Masukkan varietas"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Sumber Air</Typography>
          <TextField
            type="text"
            name="sumber_air"
            className="p-2 border rounded"
            value={form.sumber_air}
            onChange={handleChange}
            placeholder="Masukkan sumber air"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <Typography>OPT (Organisme Pengganggu Tanaman)</Typography>
          <TextField
            type="text"
            name="opt"
            className="p-2 border rounded"
            value={form.opt}
            onChange={handleChange}
            placeholder="Masukkan OPT"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <Typography>Keterangan (opsional)</Typography>
          <TextField
            name="keterangan"
            className="p-2 border rounded"
            rows="3"
            multiline
            value={form.keterangan}
            onChange={handleChange}
            placeholder="Tambahkan keterangan jika diperlukan"
          ></TextField>
        </div>

        <div className="md:col-span-2">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            fullWidth
            className="w-full  p-2 rounded"
          >
            Submit Data
          </Button>
        </div>
      </form>
    </div>
  );
}

export function HeadTableViewData() {
  return (
    <>
      <TableHead sx={{ width: "100%" }}>
        <TableRow>
          <TableCell>Tanggal</TableCell>

          <TableCell>Umur HSS</TableCell>
          <TableCell>Umur Tanaman</TableCell>
          <TableCell>Curah Hujan (mm)</TableCell>
          <TableCell>Sifat Hujan</TableCell>
          <TableCell>Diinput oleh</TableCell>
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

                <TableCell>{item.umur_hss || "-"} hari</TableCell>
                <TableCell>{item.umur_tanaman || "-"} hari</TableCell>
                <TableCell>{item.curah_hujan || "-"}</TableCell>
                <TableCell>{item.sifat_hujan || "-"}</TableCell>
                <TableCell>{item.User?.nama || "-"}</TableCell>
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
