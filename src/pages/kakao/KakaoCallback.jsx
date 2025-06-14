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
                alert("로그인 성공!");
                navigate("/main");
            } catch (error) {
                console.error("카카오 로그인 실패:", error);
                alert("로그인 실패! 다시 시도해주세요.");
                navigate("/");
            }
        };
        handleKakaoLogin();
    }, [location, navigate, setUser]);

    return <div>로그인 처리 중...</div>;
}