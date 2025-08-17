import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useUsers() {
  const [user, setUser] = useState([]);

  const fetchDataUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const json = await response.json();
      setUser(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  return user;
}