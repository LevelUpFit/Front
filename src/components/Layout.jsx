import Menubar from "./Menubar";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            {/* ✅ 상단 고정 로고 */}
            <header className="bg-white py-4 flex justify-center border-b">
                <img
                    src={logo}
                    alt="LevelUpFit"
                    className="h-14 object-contain"
                />
            </header>

            {/* ✅ 페이지 내용 (여기 px-6 제거함) */}
            <main className="flex-1 pb-20 bg-gray-200">{children}</main>

            <Menubar />
        </div>
    );
}
