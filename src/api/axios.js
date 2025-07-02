// frontend/src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // kerak bo‘lsa
});

export default instance;
