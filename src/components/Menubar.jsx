import { useLocation, useNavigate } from "react-router-dom";
import worksIcon from "../icon/works.png";
import routineIcon from "../icon/routine.png";
import feedbackIcon from "../icon/feedback.png";
import userIcon from "../icon/user.png";

const tabs = [
    { 
        label: "홈", 
        path: "/main",
        icon: (isActive) => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    { 
        label: "운동", 
        imgIcon: worksIcon, 
        path: "/workout"
    },
    { 
        label: "루틴", 
        imgIcon: routineIcon, 
        path: "/routine"
    },
    { 
        label: "피드백", 
        imgIcon: feedbackIcon, 
        path: "/feedback"
    },
    { 
        label: "내 정보", 
        imgIcon: userIcon, 
        path: "/my"
    },
];

export default function Menubar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="w-full bg-black/30 backdrop-blur-lg border-t border-white/20 z-10 flex-shrink-0">
            <div className="flex justify-around max-w-md mx-auto">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`flex-1 flex flex-col items-center justify-center p-3 transition ${
                                isActive ? "text-purple-400" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab.icon ? (
                                tab.icon(isActive)
                            ) : (
                                <img 
                                    src={tab.imgIcon} 
                                    alt={tab.label} 
                                    className={`w-6 h-6 mb-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                                    style={isActive ? {filter: 'brightness(0) saturate(100%) invert(58%) sepia(87%) saturate(5467%) hue-rotate(238deg) brightness(99%) contrast(93%)'} : {}}
                                />
                            )}
                            <span className={`text-xs ${isActive ? 'font-bold' : ''} mt-1`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
