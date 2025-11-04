import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import defaultImg from "../../assets/default.png";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function WorkoutSummary() {
    const navigate = useNavigate();
    const location = useLocation();
    const { exercises = [], startTime, endTime, muscle } = location.state || {};

    const [totalWeight, setTotalWeight] = useState(0);
    const [duration, setDuration] = useState("00:00");
    const today = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const hasExercises = exercises && exercises.length > 0;

    const completedSetsCount = useMemo(() => {
        if (!hasExercises) return 0;
        return exercises.reduce((acc, exercise) => acc + (exercise.sets?.length || 0), 0);
    }, [exercises, hasExercises]);

    useEffect(() => {
        let weight = 0;
        exercises.forEach((ex) => {
            ex.sets.forEach((set) => {
                weight += (set.weight || 0) * (set.reps || 0);
            });
        });
        setTotalWeight(weight);

        if (startTime && endTime) {
            const diff = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
            const min = String(Math.floor(diff / 60)).padStart(2, "0");
            const sec = String(diff % 60).padStart(2, "0");
            setDuration(`${min}:${sec}`);
        }
    }, [exercises, startTime, endTime]);

    return (
        <Layout>
            <div className="space-y-5">
                <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-6 text-center text-2xl font-bold text-white shadow-lg">
                    오늘도 득근 성공!
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center text-white shadow-xl backdrop-blur-lg">
                    <div className="text-xl font-bold">{muscle || "오늘의 운동"}</div>
                    <div className="mt-4 flex items-center justify-around text-sm">
                        <div className="w-1/3">
                            <p className="text-2xl font-bold text-purple-300">{totalWeight.toLocaleString()}</p>
                            <p className="text-gray-300">총 볼륨 (Kg)</p>
                        </div>
                        <div className="w-1/3 border-x border-white/20">
                            <p className="text-2xl font-bold text-purple-300">{duration}</p>
                            <p className="text-gray-300">운동 시간</p>
                        </div>
                        <div className="w-1/3">
                            <p className="text-lg font-semibold text-purple-300">{today}</p>
                            <p className="text-gray-300">완료 날짜</p>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-300">
                        총 {completedSetsCount}세트 완료
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">완료한 운동</h3>
                    {hasExercises ? (
                        exercises.map((ex, idx) => {
                            const imageSrc = ex.thumbnailUrl
                                ? `${IMAGE_BASE_URL}${ex.thumbnailUrl}`
                                : ex.imageUrl
                                ? `${IMAGE_BASE_URL}${ex.imageUrl}`
                                : defaultImg;
                            const volume = ex.sets.reduce(
                                (acc, set) => acc + (set.weight || 0) * (set.reps || 0),
                                0
                            );

                            return (
                                <div
                                    key={`${ex.name}-${idx}`}
                                    className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={imageSrc}
                                            alt={ex.name}
                                            className="h-16 w-16 rounded-lg bg-black/20 object-cover"
                                        />
                                        <div className="min-w-0 text-white">
                                            <p className="truncate text-lg font-semibold">{ex.name}</p>
                                            <p className="text-sm text-purple-200">{ex.sets.length} 세트 완료</p>
                                        </div>
                                        <div className="ml-auto text-right text-sm text-purple-200">
                                            <p className="text-base font-semibold text-purple-300">
                                                {volume.toLocaleString()} Kg
                                            </p>
                                            <p className="text-xs text-gray-300">볼륨</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-200">
                                        {ex.sets.map((set, setIdx) => (
                                            <div
                                                key={setIdx}
                                                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                            >
                                                <span className="text-purple-200">세트 {setIdx + 1}</span>
                                                <span className="font-semibold text-white">
                                                    {set.weight || 0}Kg · {set.reps || 0}회
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center text-gray-300">
                            완료된 운동이 없습니다.
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate("/main")}
                    className="w-full transform rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition duration-300 hover:scale-105"
                >
                    메인으로
                </button>
            </div>
        </Layout>
    );
}
