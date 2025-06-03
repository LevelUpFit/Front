// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 필요시 쿠키/세션 전달 (선택)
});

export default api;
