import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoutineExercises, getExerciseById } from "../../api/exercise";
import Layout from "../../components/Layout";
import defaultImg from "../../assets/default.png";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function RoutineInfo() {
    const navigate = useNavigate();
    const { routineId } = useParams();
    const [exercises, setExercises] = useState([]);
    const [exerciseDetails, setExerciseDetails] = useState({}); // 운동 id별 상세 정보

    useEffect(() => {
        const fetchRoutineInfo = async () => {
            try {
                const res = await getRoutineExercises(routineId);
                if (res.data.success) {
                    setExercises(res.data.data);

                    // 각 운동의 id로 상세 정보 병렬 조회
                    const detailsArr = await Promise.all(
                        res.data.data.map((ex) => getExerciseById(ex.exerciseId))
                    );
                    // id: 상세정보 형태로 변환
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
                console.error("루틴 정보 불러오기 실패", err);
            }
        };
        fetchRoutineInfo();
    }, [routineId]);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">루틴 상세 정보</h2>
                    <p className="text-sm text-purple-200">
                        오늘의 루틴을 확인하고 바로 운동을 시작해 보세요.
                    </p>
                </div>

                {exercises.length === 0 ? (
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center text-gray-200 backdrop-blur-lg">
                        등록된 운동이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exercises.map((ex) => {
                            const detail = exerciseDetails[ex.exerciseId];
                            const thumbnail = detail?.thumbnailUrl
                                ? `${IMAGE_BASE_URL}${detail.thumbnailUrl}`
                                : defaultImg;
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => navigate(`/exercise-info/${ex.exerciseId}`)}
                                    className="flex w-full items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 text-left text-white shadow-2xl transition hover:border-purple-400 hover:bg-white/15"
                                >
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/10">
                                        <img
                                            src={thumbnail}
                                            alt={detail?.name || "운동"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-lg font-bold">
                                            {detail?.name || `운동 ID: ${ex.exerciseId}`}
                                        </p>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-purple-200">
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-center">
                                                세트 {ex.sets}개
                                            </span>
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-center truncate">
                                                반복 {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}회
                                            </span>
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-center">
                                                휴식 {ex.restTime}초
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                <button
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                    onClick={() => navigate(`/workout/group/${routineId}`)}
                >
                    시작하기
                </button>
            </div>
        </Layout>
    );
}