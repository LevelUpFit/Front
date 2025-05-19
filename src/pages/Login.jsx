import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import BackButton from "../components/BackButton";
import logo from "../assets/logo.png"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFilled = email && password && isValidEmail;

    const handleLogin = async () => {
        if (!isValidEmail) return alert("이메일 형식 확인!");

        try {
            const res = await fetch("http://localhost:8080/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: email,
                    pwd: password,
                }),
            });

            if (!res.ok) return alert("로그인 실패");

            const userInfo = await res.json();
            setUser(userInfo); // Zustand + localStorage 저장
            alert("로그인 성공!");
            navigate("/home");
        } catch (err) {
            alert("서버 오류");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4 relative">
            <BackButton />

            <img
                src={logo}
                alt="LevelUpFit"
                className="w-4/5 max-w-xs object-contain"
            />

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

            <a
                href="http://localhost:8080/oauth2/authorization/kakao"
                className="w-full max-w-md bg-yellow-300 text-black py-3 text-center rounded font-semibold"
            >
                카카오 로그인
            </a>
        </div>
    );
}
