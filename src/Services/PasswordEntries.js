import API_BASE_URL from "../Config/api";
import axios from "axios";

export const getPasswordEntries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/PasswordEntries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching password entries:", error);
    throw error;
  }
};

export const getPasswordEntryById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/PasswordEntries/${id}`);
  return res.data;
};

export const createPassword = async (website, username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/PasswordEntries`, {
      website,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error to Post the Password : ", error);
    throw error;
  }
};

export const deletePassword = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/PasswordEntries/${id}`
    );
  } catch (error) {
    console.error("Error to Delete the Password : ", error);
    throw error;
  }
};

export const updatePassword = async (id, website, username, password) => {
  const response = await axios.put(
    `${API_BASE_URL}/PasswordEntries/${id}`,
    { website, username, password },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const revealPassword = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/PasswordEntries/${id}/reveal`, {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data.password;
};
