import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import chestImg from "../assets/chest.png";
import backImg from "../assets/back.png";
import legImg from "../assets/leg.png";
import shoulderImg from "../assets/shoulder.png";

const partData = {
    chest: {
        label: "가슴 운동",
        image: chestImg,
        exercises: ["인클라인 벤치프레스", "벤치프레스", "체스트 플라이", "딥스"]
    },
    back: {
        label: "등 운동",
        image: backImg,
        exercises: ["랫풀다운", "데드리프트", "시티드 로우", "바벨 로우"]
    },
    leg: {
        label: "하체 운동",
        image: legImg,
        exercises: ["스쿼트", "레그 프레스", "런지", "레그 익스텐션"]
    },
    shoulder: {
        label: "어깨 운동",
        image: shoulderImg,
        exercises: ["숄더 프레스", "사이드 레터럴 레이즈", "프론트 레이즈", "벤트오버 레터럴 레이즈"]
    },
};

export default function MainPage() {
    const navigate = useNavigate();
    const [part, setPart] = useState("chest");

    useEffect(() => {
        const keys = Object.keys(partData);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setPart(randomKey);
    }, []);

    const { label, image, exercises } = partData[part];

    const handleShowAlert = () => {
        alert("전체 운동 보기 기능 준비 중");
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* video 평가하기 카드 (핵심 기능이므로 상단에 배치) */}
                <div 
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl flex items-center space-x-4 transition transform hover:scale-[1.02] hover:border-purple-400 cursor-pointer"
                    onClick={() => navigate("/video-guide")}
                >
                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-xl shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1">AI 자세 분석</h2>
                        <p className="text-sm text-gray-300">영상을 업로드하고 정확한 피드백을 받아보세요.</p>
                    </div>
                </div>

                {/* 랜덤 운동 부위 카드 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-purple-300 font-semibold">오늘의 추천 운동</p>
                            <h2 className="text-2xl font-bold">{label}</h2>
                        </div>
                        <button
                            onClick={handleShowAlert}
                            className="text-sm text-purple-300 hover:text-white font-semibold"
                        >
                            전체 보기
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <ul className="text-base font-medium leading-7 space-y-1">
                            {exercises.slice(0, 4).map((ex, idx) => (
                                <li key={idx} className="flex items-center">
                                    <span className="text-purple-400 mr-2">✓</span>
                                    <span>{ex}</span>
                                </li>
                            ))}
                        </ul>
                        <img src={image} alt={part} className="w-24 h-24 object-cover flex-shrink-0" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
