import axios from "axios";
export const baseURL = "http://192.168.1.67:8000";
const baseURLmain = "http://192.168.1.67:8000/main";
export const phone = +919567960644;
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