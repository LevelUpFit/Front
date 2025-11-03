import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getExerciseById } from "../../api/exercise";
import defaultThumbnail from "../../assets/default.png";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function ExerciseInfo() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const thumbnailUrl = useMemo(() => {
        if (!exercise) return defaultThumbnail;
        if (!exercise.thumbnailUrl) return defaultThumbnail;
        return `${IMAGE_BASE_URL || ""}${exercise.thumbnailUrl}`;
    }, [exercise]);

    const infoChips = useMemo(() => {
        if (!exercise) return [];
        const chips = [];
        if (exercise.targetMuscle) chips.push({ label: "타겟 근육", value: exercise.targetMuscle });
        if (exercise.equipment) chips.push({ label: "장비", value: exercise.equipment });
        if (exercise.level) chips.push({ label: "난이도", value: exercise.level });
        return chips;
    }, [exercise]);

    useEffect(() => {
        const fetchExercise = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getExerciseById(exerciseId);
                if (res.data.success) {
                    setExercise(res.data.data);
                } else {
                    setExercise(null);
                    setError("운동 정보를 불러오지 못했어요.");
                }
            } catch (e) {
                setExercise(null);
                setError("운동 정보를 불러오지 못했어요.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchExercise();
    }, [exerciseId]);

    return (
        <Layout>
            <div className="flex min-h-full flex-col gap-6 p-0">
                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-gray-300 backdrop-blur-sm">
                            운동 정보를 불러오는 중입니다...
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-6 py-4 text-rose-200 backdrop-blur-sm">
                            {error}
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur-lg transition hover:bg-white/20"
                        >
                            이전 화면으로 돌아가기
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center gap-6">
                        <div className="relative w-full max-w-md">
                            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-purple-500/60 to-indigo-500/60 blur opacity-70" />
                            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                                <img
                                    src={thumbnailUrl}
                                    alt={exercise.name}
                                    className="h-48 w-full rounded-2xl object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex w-full max-w-md flex-col items-center gap-3 text-center text-white">
                            <h2 className="text-3xl font-bold tracking-tight">{exercise.name}</h2>
                            <div className="flex flex-wrap justify-center gap-2 text-sm text-purple-200">
                                {infoChips.length > 0 ? (
                                    infoChips.map((chip) => (
                                        <span
                                            key={`${chip.label}-${chip.value}`}
                                            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-lg"
                                        >
                                            <span className="text-gray-300">{chip.label}</span>
                                            <span className="ml-1 font-semibold text-white">{chip.value}</span>
                                        </span>
                                    ))
                                ) : (
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-purple-200">
                                        타겟 근육: {exercise.targetMuscle || "정보 없음"}
                                    </span>
                                )}
                            </div>
                            {exercise.feedbackAvailable === false && (
                                <span className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-200">
                                    피드백 기능 미지원 운동입니다
                                </span>
                            )}
                        </div>

                        <div className="w-full max-w-md space-y-4">
                            <section className="rounded-2xl border border-white/20 bg-white/10 p-5 text-left text-gray-200 shadow-xl backdrop-blur-lg">
                                <h3 className="text-lg font-semibold text-white">운동 설명</h3>
                                <p className="mt-2 leading-relaxed text-gray-200">
                                    {exercise.description || "운동 설명을 준비 중입니다."}
                                </p>
                            </section>
                            {exercise.caution && (
                                <section className="rounded-2xl border border-rose-400/40 bg-rose-400/10 p-5 text-left text-rose-100 backdrop-blur-lg">
                                    <h3 className="text-lg font-semibold">주의 사항</h3>
                                    <p className="mt-2 leading-relaxed">{exercise.caution}</p>
                                </section>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}