import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useUsers() {
  const [user, setUser] = useState([]);

  const fetchDataUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/users`, {
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

export function useProfile() {
  const [profile, setProfile] = useState([]);

  const fetchDataProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const json = await response.json();
      setProfile(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);

  return profile;
}