import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { kakaoCallback } from "../../api/kakao";
import useUserStore from "../../stores/userStore";

export default function KakaoCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useUserStore((state) => state.setUser);
    const calledRef = useRef(false); // 플래그 추가

    useEffect(() => {
        const handleKakaoLogin = async () => {
            if (calledRef.current) return; // 이미 실행됐으면 중복 방지
            calledRef.current = true;

            try {
                const params = new URLSearchParams(location.search);
                const code = params.get("code");

                if (!code) return;

                console.log("카카오 callback 보내기");
                const res = await kakaoCallback(code);

                setUser(res.data.data);
                navigate("/main");
            } catch (error) {
                console.error("카카오 로그인 실패:", error);
                alert("로그인 실패! 다시 시도해주세요.");
                navigate("/");
            }
        };
        handleKakaoLogin();
    }, [location, navigate, setUser]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#1a1a2e]">
            <div className="flex flex-col items-center gap-6">
                {/* 로딩 스피너 */}
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 opacity-80"></div>
                    </div>
                </div>
                
                {/* 텍스트 */}
                <div className="text-center">
                    <p className="text-lg font-semibold text-white">로그인 중</p>
                    <p className="mt-1 text-sm text-purple-200">잠시만 기다려주세요...</p>
                </div>
            </div>
        </div>
    );
}