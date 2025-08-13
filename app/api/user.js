import { useState, useEffect } from "react";

export function useUsers() {
  const [user, setUser] = useState([]);

  const fetchDataUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", {
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