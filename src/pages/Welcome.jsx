// src/pages/Welcome.jsx
import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
            <div className="border-4 border-black rounded-full px-8 py-4 text-4xl font-black">
                LevelUpFit
            </div>

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
            <button className="w-full max-w-md bg-yellow-400 py-4 text-lg font-semibold flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>카카오 로그인</span>
            </button>
        </div>
    );
}
