import axios from "axios";
// import { cookies } from 'next/headers';

const minuteTimeout = (time: number) => time * 60 * 1000;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
  timeout: minuteTimeout(2),
  withCredentials: true
});

// Modified request interceptor that works in both client and server contexts
// axiosInstance.interceptors.request.use(async (config) => {
//   const sid = (await cookies()).get('shadow-vault')

//   console.log(sid)
  
//   if (sid) {
//     config.headers.Cookie = `shadow-vault=${sid}`;
//   }
  
//   return config;
// });

export default axiosInstance;