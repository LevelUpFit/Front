import { useState } from "react";
import BackButton from "../components/BackButton";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    const isFilled = email && password && isValidEmail;

    const handleLogin = () => {
        if (!isValidEmail) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        alert("로그인 시도!");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4 relative">
            <BackButton />

            <div className="border-4 border-black rounded-full px-8 py-4 text-4xl font-black">
                LevelUpFit
            </div>

            <input
                type="email"
                placeholder="이메일을 입력해주세요"
                className="w-full max-w-md px-4 py-3 border rounded-lg text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full max-w-md px-4 py-3 border rounded-lg text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {!isValidEmail && email && (
                <p className="text-sm text-red-500">이메일 형식이 올바르지 않습니다.</p>
            )}

            <button
                onClick={handleLogin}
                disabled={!isFilled}
                className={`w-full max-w-md py-4 text-xl font-bold rounded ${
                    isFilled ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                로그인
            </button>
        </div>
    );
}
