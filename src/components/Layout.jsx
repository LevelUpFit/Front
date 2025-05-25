import { useNavigate } from "react-router-dom";
import Menubar from "./Menubar";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            {/* ✅ 상단 고정 로고 (클릭 시 메인 페이지 이동) */}
            <header className="bg-white py-4 px-4 flex justify-center items-center border-b fixed top-0 w-full z-50">
                <button onClick={() => navigate("/main")} className="focus:outline-none">
                    <img
                        src={logo + ""}  // 타입 오류 방지용 문자열 처리
                        alt="LevelUpFit"
                        className="w-48 h-auto object-contain"
                    />
                </button>
            </header>

            {/* ✅ 페이지 내용 */}
            <main className="flex-1 pb-20 pt-24 px-4 overflow-y-auto">
                {children}
            </main>

            {/* ✅ 하단 탭 */}
            <Menubar />
        </div>
    );
}
