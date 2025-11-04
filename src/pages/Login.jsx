import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import BackButton from "../components/BackButton";
import logo from "../assets/logo.png";
import { login } from "../api/auth";
import { kakaoLogin } from "../api/kakao";
import kakaoLoginImg from "../assets/kakao_login.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // 에러 메시지 상태
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFilled = email && password && isValidEmail;

    const handleLogin = async (e) => {
        e.preventDefault(); 

        if (!isValidEmail && email) {
            setError("이메일 형식이 올바르지 않습니다.");
            return;
        }
        setError("");

        try {
            const res = await login(email, password);
            setUser(res.data.data);
            console.log("로그인 성공!");
            navigate("/main");
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("이메일 또는 비밀번호를 확인해주세요.");
        }
    };

    const handleSocialLogin = async () => {
        try {
            const response = await kakaoLogin();
            window.location.href = response.data;
            console.log("카카오 로그인 URL:", response);
        } catch (error) {
            console.error("로그인 중 오류 발생", error);
            setError("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-4 font-sans">
            <BackButton />

            <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <header className="text-center mb-8">
                    <img
                        src={logo}
                        alt="LevelUpFit 로고"
                        className="w-40 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-white">다시 오신 것을 환영합니다</h1>
                    <p className="text-gray-300 mt-2">운동 자세를 완벽하게 레벨업하세요</p>
                </header>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </span>
                        <input
                            type="email"
                            placeholder="이메일"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </span>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && (
                        <p className="text-sm text-red-400 text-center pt-1">{error}</p>
                    )}

                    <div className="text-right text-sm">
                        <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!isFilled}
                        className={`w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105
                            ${isFilled
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                                : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        로그인
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-white/20"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">또는</span>
                    <div className="flex-grow border-t border-white/20"></div>
                </div>

                <button
                    onClick={handleSocialLogin}
                    className="w-full"
                >
                    <img
                        src={kakaoLoginImg}
                        alt="카카오 로그인"
                        className="w-full h-auto max-w-xs mx-auto rounded-lg transition-transform duration-300 transform hover:scale-105"
                    />
                </button>
                
                <div className="mt-8 text-center text-sm text-gray-300">
                    <p>
                        아직 계정이 없으신가요?
                        <a href="#" className="font-medium text-purple-400 hover:text-purple-300 ml-2">
                            회원가입
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
