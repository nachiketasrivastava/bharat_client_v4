import axios from "axios";
export const Client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://app.gtmcopilot.com/api_v3/",
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
    // "Authorization": "Bearer ${token}"
    "Authorization": "Bearer token"
  },
});