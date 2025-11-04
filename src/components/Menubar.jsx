import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "../icon/home.svg?react";
import ExerciseIcon from "../icon/exercise.svg?react";
import RoutineIcon from "../icon/routine.svg?react";
import FeedbackIcon from "../icon/feedback.svg?react";
import MypageIcon from "../icon/mypage.svg?react";

const tabs = [
    { 
        label: "홈", 
        path: "/main",
        Icon: HomeIcon
    },
    { 
        label: "운동", 
        Icon: ExerciseIcon, 
        path: "/workout"
    },
    { 
        label: "루틴", 
        Icon: RoutineIcon, 
        path: "/routine"
    },
    { 
        label: "피드백", 
        Icon: FeedbackIcon, 
        path: "/feedback"
    },
    { 
        label: "내 정보", 
        Icon: MypageIcon, 
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
                    const { Icon } = tab;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`flex-1 flex flex-col items-center justify-center p-3 transition ${
                                isActive ? "text-purple-400" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <Icon className="w-6 h-6 mb-1" />
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
