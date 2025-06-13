import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { kakaoCallback } from "../../api/kakao";
import useUserStore from "../../stores/userStore";

export default function KakaoCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useUserStore((state) => state.setUser);

    useEffect( async () => {
        try{
            // 쿼리스트링에서 토큰 추출
            const params = new URLSearchParams(location.search);
            const code = params.get("code");

            const res = await kakaoCallback(code);
            setUser(res.data.data);
            alert("로그인 성공!");
            navigate("/main");
        }catch (error) {
            console.error("카카오 로그인 실패:", error);
            alert("로그인 실패! 다시 시도해주세요.");
            navigate("/login");
            return;
        }
    }, [location, navigate]);

    return <div>로그인 처리 중...</div>;
}