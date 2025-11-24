import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useUserStore from "../stores/userStore";

export default function SplashPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoggedIn) {
                navigate('/main');
            } else {
                navigate('/login');
            }
        }, 2500); // 2.5초

        return () => clearTimeout(timer);
    }, [navigate, isLoggedIn]);

    return (
        <>
            <style>{`
                @keyframes fadeInScaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeInScaleUp {
                    animation: fadeInScaleUp 1s ease-out forwards;
                }
                .animate-fadeInDelayed {
                    animation: fadeIn 0.8s ease-out 0.5s forwards;
                    opacity: 0;
                }
            `}</style>

            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white font-sans">
                <div className="animate-fadeInScaleUp">
                    <img
                        src={logo}
                        alt="LevelUpFit 로고"
                        className="w-48 mx-auto"
                    />
                </div>
                <div className="absolute bottom-24 flex flex-col items-center animate-fadeInDelayed">
                    <div className="w-6 h-6 border-4 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
                    <p className="mt-3 text-gray-300 text-sm">Loading...</p>
                </div>
            </div>
        </>
    );
}
