import Menubar from "./Menubar";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            {/* ✅ 상단 고정 로고 */}
            <header className="bg-white py-4 px-4 flex justify-center items-center border-b fixed top-0 w-full z-50">
                <img
                    src={logo}
                    alt="LevelUpFit"
                    className="w-48 h-auto object-contain"
                />
            </header>

            {/* ✅ 페이지 내용 (여기 px-6 제거함) */}
            <main className="flex-1 pb-20 pt-24 px-4 overflow-y-auto">
                {children}
            </main>

            <Menubar/>
        </div>
    );
}
