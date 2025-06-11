import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 필요시 쿠키/세션 전달 (선택)
});

export default api;
