import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCurahHujanAllData() {
  const [rows, setRows] = useState([]);

  const fetchDataCurahHujanAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/curah-hujan`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const json = await response.json();
      setRows(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataCurahHujanAllData();
  }, []);

  return rows;
}

export function useCurahHujanByMonth(bulan, tahun) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!bulan || !tahun) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/curah-hujan/by-month?bulan=${bulan}&tahun=${tahun}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        setRows(json.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bulan, tahun]);

  return rows;
}

export function useUpdateCurahHujan() {
  const updateCurahHujan = async (id, data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curah-hujan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  };

  return { updateCurahHujan };
}


export function useGetCurahHujanById(id) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/curah-hujan/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        setData(json.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return data;
}

export function useDeleteCurahHujan(id) {
  const deleteData = async () => {
    try {
      const response = await fetch(`${API_URL}/curah-hujan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  };

  return deleteData;
}
