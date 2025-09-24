import API_BASE_URL from "../Config/api";

export const getPasswordEntries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/passwordentries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching password entries:", error);
    throw error;
  }
};
