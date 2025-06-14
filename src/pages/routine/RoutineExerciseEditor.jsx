import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllExercises } from "../../api/exercise";
import { getRoutineExercises } from "../../api/exercise"; // 추가

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function RoutineExerciseEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { routineId } = location.state || {};

    const [exercises, setExercises] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);

    // 기존 루틴의 운동 불러오기
    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            try {
                // 전체 운동 목록 불러오기
                const res = await getAllExercises();
                let all = [];
                if (res.data && res.data.success) {
                    all = res.data.data;
                    setExercises(all);
                } else {
                    setExercises([]);
                }

                // 루틴 ID가 있으면 해당 루틴의 운동도 선택 처리
                if (routineId) {
                    // 루틴 내 운동 조회 API 사용
                    const routineExRes = await getRoutineExercises(routineId);
                    if (routineExRes.data && routineExRes.data.success) {
                        // routineExRes.data.data가 [{exerciseId: ...}, ...] 형태
                        setSelected(routineExRes.data.data.map(ex => ex.exerciseId));
                    }
                }
            } catch (e) {
                setExercises([]);
            }
            setLoading(false);
        };
        fetchExercises();
    }, [routineId]);

    const toggle = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        const selectedExercises = exercises.filter((ex) => selected.includes(ex.id));
        navigate("/routine/set-editor", {
            state: {
                routineId,
                exercises: selectedExercises,
            },
        });
    };

    return (
        <div className="min-h-screen bg-white px-4 py-6">
            <h2 className="text-xl font-bold mb-4">운동 추가</h2>
            {loading ? (
                <div className="text-center py-10">운동 목록을 불러오는 중...</div>
            ) : (
                <div className="space-y-3">
                    {exercises.map((ex) => {
                        const isSelected = selected.includes(ex.id);
                        return (
                            <div
                                key={ex.id}
                                className={`flex items-center gap-3 border-b py-2 cursor-pointer rounded-lg transition-colors
        ${isSelected ? "bg-blue-100 border-blue-400" : "bg-white"} pl-3`}
                                onClick={() => toggle(ex.id)}
                                style={{ borderWidth: isSelected ? 2 : 1 }}
                            >
                                <img
                                    src={IMAGE_BASE_URL + ex.thumbnailUrl}
                                    alt={ex.name}
                                    className="w-20 h-20 object-contain"
                                    style={{ background: "#f3f3f3", borderRadius: 8 }}
                                />
                                <div>
                                    <div className="font-semibold">{ex.name}</div>
                                    <div className="text-xs text-gray-500">{ex.targetMuscle}</div>
                                    <div className="text-xs text-gray-400">{ex.description}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <button
                className="w-full bg-blue-600 text-white rounded py-3 font-bold mt-6"
                onClick={handleNext}
                disabled={selected.length === 0}
            >
                {selected.length > 0 ? `운동 ${selected.length}개 선택 완료` : "운동 선택"}
            </button>
        </div>
    );
}