// src/pages/Welcome.jsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { kakaoLogin } from "../api/kakao";
import kakaoLoginImg from "../assets/kakao_login.png"; // 이미지 파일 import

export default function Welcome() {
    const navigate = useNavigate();

    const handleSocialLogin = async () => {
        try {
            const response = await kakaoLogin();
            window.location.href = response.data;
            console.log("카카오 로그인 URL:", response);
        } catch (error) {
            console.error("로그인 중 오류 발생", error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
            <img
                src={logo}
                alt="LevelUpFit"
                className="w-4/5 max-w-xs object-contain"
            />

            <button
                onClick={() => navigate("/login")}
                className="w-full max-w-md bg-gray-300 py-4 text-xl font-bold"
            >
                로그인
            </button>
            <button
                onClick={() => navigate("/signup")}
                className="w-full max-w-md bg-gray-300 py-4 text-xl font-bold"
            >
                회원가입
            </button>
            <button
                onClick={handleSocialLogin}
                className="w-full max-w-md flex items-center justify-center"
                style={{ padding: 0, background: "transparent", borderRadius: 0, height: "auto" }}
            >
                <img
                    src={kakaoLoginImg}
                    alt="카카오 로그인"
                    style={{ display: "block", width: "100%", height: "auto", maxWidth: 300, pointerEvents: "auto" }}
                />
            </button>
        </div>
    );
}
