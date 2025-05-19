import { useLocation, useNavigate } from "react-router-dom";
import worksIcon from "../icon/works.png";
import routineIcon from "../icon/routine.png";
import feedbackIcon from "../icon/feedback.png";
import userIcon from "../icon/user.png";


const tabs = [
    { label: "운동", icon: worksIcon, path: "/workout" },
    { label: "루틴", icon: routineIcon, path: "/routine" },
    { label: "피드백", icon: feedbackIcon, path: "/feedback" },
    { label: "내 정보", icon: userIcon, path: "/my" },
];

export default function Menubar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-2 z-50">
            {tabs.map((tab) => (
                <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={`flex flex-col items-center text-xs font-semibold ${
                        location.pathname === tab.path ? "text-black" : "text-gray-400"
                    }`}
                >
                    <img src={tab.icon} alt={tab.label} className="w-6 h-6 mb-1" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
