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

    return (
        <Layout>
            <div className="px-4 py-6 space-y-6">
                {/* 랜덤 운동 부위 카드 */}
                <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center min-h-[200px] mb-8">
                    <div className="flex-1 pr-6">
                        <h2 className="text-2xl font-bold mb-4">{label}</h2>
                        <ul className="text-base font-medium leading-7">
                            {exercises.map((ex, idx) => (
                                <li key={idx}>{ex}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full">
                        <button
                            onClick={() => alert("전체 운동 보기 기능 준비 중")}
                            className="text-blue-600 text-base font-semibold mt-4"
                        >
                            전체 보기
                        </button>
                        <img src={image} alt={part} className="w-36 h-auto"/>
                    </div>
                </div>

                {/* video 평가하기 카드 */}
                <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center min-h-[200px]">
                    <div className="flex-1 pr-6">
                        <h2 className="text-2xl font-bold mb-4">video 평가하기</h2>
                        <div
                            onClick={() => navigate("/video-guide")}
                            className="w-32 h-24 border-2 border-black rounded-lg flex items-center justify-center cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z" />
                            </svg>
                        </div>
                    </div>
                    <img src={image} alt="muscle" className="w-36 h-auto" />
                </div>
            </div>
        </Layout>
    );
}
