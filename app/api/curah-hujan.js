import { useState, useEffect } from "react";

export function useCurahHujanAllData() {
  const [rows, setRows] = useState([]);

  const fetchDataCurahHujanAllData = async () => {
    try {
      const response = await fetch("http://localhost:3001/curah-hujan", {
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
          `http://localhost:3001/curah-hujan/by-month?bulan=${bulan}&tahun=${tahun}`,
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
