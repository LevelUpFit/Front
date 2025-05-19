// src/pages/Welcome.jsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Welcome() {
    const navigate = useNavigate();

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
                className="w-full max-w-md bg-yellow-400 py-4 text-lg font-semibold flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>카카오 로그인</span>
            </button>
        </div>
    );
}
