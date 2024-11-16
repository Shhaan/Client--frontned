import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const baseURLmain = process.env.REACT_APP_BASE_URL_MAIN;
export const phone = process.env.REACT_APP_PHONE;
export const whatsappapi = process.env.REACT_APP_WHATSAPP_API;

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
