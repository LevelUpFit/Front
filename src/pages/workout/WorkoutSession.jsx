import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import useUserStore from "../../stores/userStore";
import { getRoutineExercises, getExerciseById } from "../../api/exercise";
import defaultImg from "../../assets/default.png";
import { saveRoutineLog } from "../../api/userlog";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

function SetCheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function CurrentSetIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-300"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function WorkoutSession() {
    const { routineId } = useParams();
    const navigate = useNavigate();

    const { getUserId } = useUserStore();
    const [exercises, setExercises] = useState([]);
    const [exerciseDetails, setExerciseDetails] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sets, setSets] = useState([]);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);

    // 스크롤 ref 추가
    const listRef = useRef(null);

    useEffect(() => {
        setStartTime(new Date());

        const fetchExercises = async () => {
            try {
                const res = await getRoutineExercises(routineId);
                if (res.data.success) {
                    // order 순서대로 정렬
                    const sorted = res.data.data
                        .slice()
                        .sort((a, b) => (a.exerciseOrder || 0) - (b.exerciseOrder || 0));
                    setExercises(sorted);
                    setSets(
                        sorted.map((exercise) =>
                            Array.from({ length: exercise.sets }).map((_, idx) => ({
                                set: idx + 1,
                                weight: exercise.weight?.[idx] ?? 30,
                                reps: exercise.reps?.[idx] ?? 12,
                                done: false,
                            }))
                        )
                    );
                    // 운동 상세정보 병렬 조회
                    const detailsArr = await Promise.all(
                        sorted.map((ex) => getExerciseById(ex.exerciseId))
                    );
                    const detailsObj = {};
                    detailsArr.forEach((detailRes) => {
                        if (detailRes.data.success) {
                            const d = detailRes.data.data;
                            detailsObj[d.id] = d;
                        }
                    });
                    setExerciseDetails(detailsObj);
                }
            } catch (err) {
                console.error("운동 불러오기 실패", err);
            }
        };
        fetchExercises();
    }, [routineId]);

    const addSet = (exerciseIdx) => {
        setSets((prev) => {
            const updated = prev.map((exerciseSets) => exerciseSets.map((set) => ({ ...set })));
            const currentExerciseSets = updated[exerciseIdx];
            const lastSet = currentExerciseSets[currentExerciseSets.length - 1] || {
                weight: 30,
                reps: 12,
            };
            currentExerciseSets.push({
                set: currentExerciseSets.length + 1,
                weight: lastSet.weight,
                reps: lastSet.reps,
                done: false,
            });
            return updated;
        });
    };

    const handleSetChange = (exerciseIdx, setIdx, field, value) => {
        setSets((prev) => {
            const updated = prev.map((exerciseSets) => exerciseSets.map((set) => ({ ...set })));
            const numericValue = value === "" ? "" : Number(value);
            updated[exerciseIdx][setIdx][field] = numericValue;
            return updated;
        });
    };

    const handleNextSet = async () => {
        if (sets.length === 0) return;

        const updatedSets = sets.map((exerciseSets) =>
            exerciseSets.map((set) => ({ ...set }))
        );
        updatedSets[currentIndex][currentSetIndex].done = true;
        setSets(updatedSets);

        if (currentSetIndex < updatedSets[currentIndex].length - 1) {
            setCurrentSetIndex((prevIdx) => prevIdx + 1);
        } else if (currentIndex < exercises.length - 1) {
            setCurrentIndex((prevIdx) => prevIdx + 1);
            setCurrentSetIndex(0);
        } else {
            const endTime = new Date();
            
            // 완료된 운동 데이터 정리
            const summaryExercises = exercises.map((exercise, exerciseIdx) => ({
                ...exerciseDetails[exercise.exerciseId],
                sets: updatedSets[exerciseIdx].filter((set) => set.done),
            }));

            // 총 볼륨 계산
            let totalVolume = 0;
            summaryExercises.forEach((ex) => {
                ex.sets.forEach((set) => {
                    totalVolume += (set.weight || 0) * (set.reps || 0);
                });
            });

            // 운동 시간 계산 (초 단위)
            const durationSeconds = Math.floor((endTime - startTime) / 1000);

            // 완료된 총 세트 수
            const totalSets = summaryExercises.reduce(
                (acc, ex) => acc + (ex.sets?.length || 0), 
                0
            );

            try {
                const userId = getUserId();
                const performedDate = new Date(Date.now() + 9 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 10);
                
                // 확장된 데이터로 저장
                await saveRoutineLog({
                    userId,
                    routineId: Number(routineId),
                    performedDate,
                    totalVolume,           // 총 볼륨 (kg)
                    durationSeconds,       // 운동 시간 (초)
                    totalSets,             // 총 세트 수
                    targetMuscle: exerciseDetails[exercises[0]?.exerciseId]?.targetMuscle || null,
                    exerciseDetails: summaryExercises.map((ex) => ({
                        exerciseId: ex.id,
                        name: ex.name,
                        sets: ex.sets.map((set) => ({
                            weight: set.weight,
                            reps: set.reps,
                        })),
                    })),
                });
            } catch (err) {
                console.error("운동 기록 저장에 실패했습니다.", err);
            }

            navigate("/workout/summary", {
                state: {
                    exercises: summaryExercises,
                    startTime,
                    endTime,
                    muscle:
                        exerciseDetails[exercises[0]?.exerciseId]?.targetMuscle || "운동",
                },
            });
        }
    };

    // 세트/운동이 바뀔 때마다 해당 카드로 스크롤
    useEffect(() => {
        if (!listRef.current) return;
        // 현재 운동 카드 DOM 찾기
        const card = listRef.current.querySelector(`[data-ex-idx="${currentIndex}"]`);
        if (card) {
            // 카드의 위치가 보이도록 스크롤(부드럽게)
            card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currentIndex, currentSetIndex]);

    if (!exercises.length || sets.length === 0) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] items-center justify-center text-gray-300">
                    로딩 중...
                </div>
            </Layout>
        );
    }

    const currentExerciseDetail = exerciseDetails[exercises[currentIndex].exerciseId];

    return (
        <Layout>
            <div className="relative mx-auto flex min-h-full max-w-md flex-col p-4">
                <header className="mb-4 flex items-center justify-between py-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
                        aria-label="뒤로 가기"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <h1 className="max-w-[240px] truncate text-xl font-bold text-white">
                            {currentExerciseDetail?.name || "운동 중"}
                        </h1>
                        <div className="text-sm text-purple-300">
                            {currentIndex + 1} / {exercises.length}
                        </div>
                    </div>
                    <div className="w-10" />
                </header>

                <div className="flex-1 overflow-y-auto pb-36" ref={listRef}>
                    {exercises.map((ex, exIdx) => {
                        const detail = exerciseDetails[ex.exerciseId];
                        const isCurrentExercise = exIdx === currentIndex;
                        return (
                            <div
                                key={ex.id}
                                data-ex-idx={exIdx}
                                className={`mb-4 flex flex-col items-center gap-2 rounded-2xl border bg-white/10 p-4 shadow-xl backdrop-blur-lg transition-all ${
                                    isCurrentExercise
                                        ? "border-purple-400"
                                        : "border-white/20 opacity-70"
                                }`}
                            >
                                <div className="flex w-full items-center gap-4">
                                    <img
                                        src={IMAGE_BASE_URL + (detail?.thumbnailUrl || "") || defaultImg}
                                        alt={detail?.name || "운동"}
                                        className="h-16 w-16 rounded-lg bg-white/10 object-contain"
                                    />
                                    <div>
                                        <div className="mb-1 text-lg font-semibold text-white">
                                            {detail?.name || `운동 ID: ${ex.exerciseId}`}
                                        </div>
                                        <div className="text-sm text-gray-300">{detail?.targetMuscle}</div>
                                    </div>
                                </div>
                                <div className="mt-2 w-full space-y-2">
                                    {sets[exIdx]?.map((set, idx) => {
                                        const isCurrentSet = isCurrentExercise && idx === currentSetIndex;
                                        const isDone = set.done;

                                        return (
                                            <div
                                                key={idx}
                                                className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                                                    isDone
                                                        ? "border-green-500/50 bg-green-600/30"
                                                        : isCurrentSet
                                                        ? "border-purple-400 bg-purple-600/30"
                                                        : "border-transparent bg-white/10"
                                                }`}
                                            >
                                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
                                                    {isDone ? (
                                                        <SetCheckIcon />
                                                    ) : isCurrentSet ? (
                                                        <CurrentSetIcon />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-400">{idx + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={set.weight}
                                                        onChange={(e) =>
                                                            handleSetChange(exIdx, idx, "weight", e.target.value)
                                                        }
                                                        className="w-20 rounded-md border-none bg-white/20 py-2 text-center text-lg font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                    />
                                                    <span className="text-base font-semibold text-gray-300">KG</span>
                                                </div>
                                                <div className="flex flex-1 items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={set.reps}
                                                        onChange={(e) =>
                                                            handleSetChange(exIdx, idx, "reps", e.target.value)
                                                        }
                                                        className="w-20 rounded-md border-none bg-white/20 py-2 text-center text-lg font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                    />
                                                    <span className="text-base font-semibold text-gray-300">회</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button
                                        onClick={() => addSet(exIdx)}
                                        className="mt-2 w-full rounded-lg bg-white/10 py-2 text-center text-gray-300 transition hover:bg-white/20"
                                    >
                                        + 세트 추가
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="fixed bottom-24 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">
                    <button
                        onClick={handleNextSet}
                        className="w-full transform rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition duration-300 hover:scale-105"
                    >
                        {currentSetIndex < sets[currentIndex]?.length - 1
                            ? "다음 세트"
                            : currentIndex < exercises.length - 1
                            ? "다음 운동"
                            : "운동 완료"}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
