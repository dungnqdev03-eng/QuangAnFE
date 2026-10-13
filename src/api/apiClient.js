import axios from "axios";
import { TOKEN_STORAGE_KEY } from "../constants";

const apiClient = axios.create({
  // baseURL: "https://globie.azurewebsites.net/api/v1",
  baseURL: "http://localhost:8080/api/v1",
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default apiClient;
