import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import BackButton from "../components/BackButton";
import logo from "../assets/logo.png";
import { login } from "../api/auth"; // ✅ 로그인 함수 가져옴
import { kakaoLogin } from "../api/kakao"; // ✅ 카카오 로그인 함수 가져옴
import kakaoLoginImg from "../assets/kakao_login.png"; // 카카오 버튼 이미지 추가

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFilled = email && password && isValidEmail;

    const handleLogin = async () => {
        if (!isValidEmail) return alert("이메일 형식이 올바르지 않습니다.");

        try {
            const res = await login(email, password); // ✅ 분리된 함수 호출
            setUser(res.data.data);
            alert("로그인 성공!");
            navigate("/main"); // 로그인 성공 후 메인 페이지로 이동
        } catch (err) {
            console.error("로그인 실패:", err);
            alert("로그인 실패! 아이디 또는 비밀번호를 확인해주세요.");
        }
    };

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
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4 ">
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
                    isFilled
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                로그인
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
