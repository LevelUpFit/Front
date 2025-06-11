import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import useUserStore from "../../stores/userStore";
import { getRoutineExercises, getExerciseById } from "../../api/exercise";
import defaultImg from "../../assets/default.png";
import setCheck from "../../assets/set-check.png";
import { saveRoutineLog } from "../../api/userlog";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function WorkoutSession() {
    const { routineId } = useParams();
    const navigate = useNavigate();

    const { getUserId } = useUserStore();
    const [exercises, setExercises] = useState([]);
    const [exerciseDetails, setExerciseDetails] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sets, setSets] = useState([]);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await getRoutineExercises(routineId);
                if (res.data.success) {
                    setExercises(res.data.data);
                    setSets(
                        res.data.data.map((exercise) =>
                            Array.from({ length: exercise.sets }).map((_, idx) => ({
                                set: idx + 1,
                                weight: 30,
                                reps: exercise.reps[idx] ?? 12,
                                done: false,
                            }))
                        )
                    );
                    // 운동 상세정보 병렬 조회
                    const detailsArr = await Promise.all(
                        res.data.data.map((ex) => getExerciseById(ex.exerciseId))
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
        setSets(prev => {
            const updated = [...prev];
            const currentExerciseSets = updated[exerciseIdx];
            const newSet = {
                set: currentExerciseSets.length + 1,
                weight: 30,
                reps: 12,
                done: false
            };
            updated[exerciseIdx] = [...currentExerciseSets, newSet];
            return updated;
        });
    };

    // 다음 세트/운동 이동 로직 (예시: 현재 운동/세트만 관리)
    const handleNextSet = async () => {
        if (sets.length === 0) return;

        setSets(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[currentIndex][currentSetIndex].done = true;
            return updated;
        });

        if (currentSetIndex < sets[currentIndex].length - 1) {
            setCurrentSetIndex(currentSetIndex + 1);
        } else if (currentIndex < exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentSetIndex(0);
        } else {
            // 마지막 세트/운동에서 저장
            try {
                // userId와 performedDate는 실제 값으로 대체 필요
                const userId = getUserId();
                // 한국 시간 기준 YYYY-MM-DD
                const performedDate = new Date(Date.now() + 9 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 10);
                const res = await saveRoutineLog(userId, routineId, performedDate);
            } catch (err) {
                alert("운동 기록 저장에 실패했습니다.");
            }
            navigate("/workout/summary");
        }
    };

    if (!exercises.length) return <Layout>로딩 중...</Layout>;

    return (
        <Layout>
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
                {/* 운동 전체 리스트 스크롤 영역 */}
                <div className="flex-1 overflow-y-auto pb-32 mt-6">
                    {exercises.map((ex, exIdx) => {
                        const detail = exerciseDetails[ex.exerciseId];
                        return (
                            <div
                                key={ex.id}
                                className={`bg-white rounded-xl shadow flex flex-col items-center gap-2 p-4 mb-4 ${
                                    exIdx === currentIndex ? "border-2 border-blue-500" : ""
                                }`}
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <img
                                        src={IMAGE_BASE_URL + (detail?.thumbnailUrl || "") || defaultImg}
                                        alt={detail?.name || "운동"}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg mb-1">
                                            {detail?.name || `운동 ID: ${ex.exerciseId}`}
                                        </div>
                                        <div className="text-gray-700">{detail?.targetMuscle}</div>
                                    </div>
                                </div>
                                {/* 세트 리스트 */}
                                <div className="w-full mt-2">
                                    {sets[exIdx] &&
                                        sets[exIdx].map((set, idx) => {
                                            const isCurrent = exIdx === currentIndex && idx === currentSetIndex;
                                            const isDone = set.done;

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center justify-between mb-2 last:mb-0 px-2 py-2 rounded-lg border
                                                        ${isDone
                                                            ? "border-green-300 bg-green-100 text-green-800"
                                                            : isCurrent
                                                            ? "border-blue-500 bg-blue-100"
                                                            : "border-gray-200 bg-gray-100"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center justify-center w-6 h-6">
                                                            {isDone
                                                                ? (
                                                                    <img
                                                                        src={setCheck}
                                                                        alt="완료"
                                                                        className="w-6 h-6 object-contain rounded-full"
                                                                    />
                                                                )
                                                                : isCurrent
                                                                ? "▶"
                                                                : "○"}
                                                        </span>
                                                        <span className="font-bold">{set.set}</span>
                                                        <span className={`px-2 py-1 rounded font-bold mx-1 bg-white ${isDone ? "text-green-600" : "text-black"}`}>
                                                            {set.weight}
                                                        </span>
                                                        <span className="font-bold">KG</span>
                                                        <span className={`px-2 py-1 rounded font-bold mx-1 bg-white ${isDone ? "text-green-600" : "text-black"}`}>
                                                            {set.reps}
                                                        </span>
                                                        <span className="font-bold">회</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    <button
                                        onClick={() => addSet(exIdx)}
                                        className="w-full text-center text-gray-600 py-2 mt-2 bg-gray-100 rounded"
                                    >
                                        + 세트 추가
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* 하단 고정 버튼 */}
                <div className="fixed bottom-11 left-0 w-full max-w-md mx-auto px-4 pb-4 z-10">
                    <button
                        onClick={handleNextSet}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow"
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
