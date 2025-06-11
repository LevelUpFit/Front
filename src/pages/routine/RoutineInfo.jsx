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
            <div className="min-h-screen p-4">
                <h2 className="text-2xl font-bold mb-4">루틴 상세 정보</h2>
                {exercises.length === 0 ? (
                    <div>운동 정보가 없습니다.</div>
                ) : (
                    <ul className="space-y-3">
                        {exercises.map((ex) => {
                            const detail = exerciseDetails[ex.exerciseId];
                            return (
                                <li
                                    key={ex.id}
                                    className="bg-white rounded-xl shadow flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-50 transition"
                                    onClick={() => navigate(`/exercise-info/${ex.exerciseId}`)} // 카드 클릭 시 이동
                                >
                                    <img
                                        src={IMAGE_BASE_URL + (detail?.thumbnailUrl || "") || defaultImg}
                                        alt={detail?.name || "운동"}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg mb-1">
                                            {detail?.name || `운동 ID: ${ex.exerciseId}`}
                                        </div>
                                        <div className="text-gray-700">세트: {ex.sets}</div>
                                        <div className="text-gray-700">반복: {ex.reps.join(", ")}회</div>
                                        <div className="text-gray-700">휴식: {ex.restTime}초</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <button 
                    className="w-full mt-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg"
                    onClick={() => navigate(`/workout/group/${routineId}`)}
                >
                    시작하기
                </button>
            </div>
        </Layout>
    );
}