import axios from "axios";

export const baseURL = "https://client-backend-r9kn.onrender.com";
const baseURLmain = "https://client-backend-r9kn.onrender.com/main";
export const phone = 974 - 30162002;
export const whatsappapi = "https://api.whatsapp.com/send/?phone";

export const axiosInstance = axios.create({
  baseURL: baseURL,
});

export const createAxiosInstanceWithAuth = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: baseURL,
    headers: { Authorization: `Token ${token}` },
  });
};

export const axiosInstancemain = axios.create({
  baseURL: baseURLmain,
});
