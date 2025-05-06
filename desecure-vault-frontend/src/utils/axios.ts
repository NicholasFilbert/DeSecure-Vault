import axios from "axios";
// import { cookies } from 'next/headers';

const minuteTimeout = (time: number) => time * 60 * 1000;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
  timeout: minuteTimeout(2),
  withCredentials: true
});

export default axiosInstance;