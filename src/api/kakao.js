import api from "./apiDev";


export const kakaoLogin = () => api.get("/user/kakao/login");

export const kakaoCallback = (code) => api.get(`/user/callback?code=${code}`);