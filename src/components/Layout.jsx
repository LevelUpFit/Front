import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import Menubar from "./Menubar";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);

    return (
        <div className="flex flex-col h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white font-sans overflow-hidden">
            {/* 상단 헤더 */}
            <header className="flex justify-between items-center p-4 pt-6 bg-gray-900/30 backdrop-blur-sm z-10 flex-shrink-0">
                <button onClick={() => navigate("/main")} className="focus:outline-none">
                    <img
                        src={logo}
                        alt="LevelUpFit"
                        className="h-8 w-auto object-contain"
                    />
                </button>
                <div className="flex items-center space-x-3">
                    <h1 className="text-sm font-medium">
                        안녕하세요, <span className="text-purple-400 font-bold">{user?.name || "사용자"}님!</span>
                    </h1>
                    <button 
                        onClick={() => navigate("/account")}
                        className="text-gray-300 hover:text-white transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 overflow-y-auto p-4">
                {children}
            </main>

            {/* 하단 네비게이션 바 */}
            <Menubar />
        </div>
    );
}
