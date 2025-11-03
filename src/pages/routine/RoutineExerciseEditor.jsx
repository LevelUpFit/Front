import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllExercises, getRoutineExercises } from "../../api/exercise";
import Layout from "../../components/Layout";

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
        <Layout>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">운동 추가</h2>
                    <p className="text-sm text-purple-200">
                        루틴에 포함할 운동을 선택하세요.
                    </p>
                </div>
                {loading ? (
                    <div className="flex min-h-[30vh] items-center justify-center text-gray-300">
                        운동 목록을 불러오는 중...
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exercises.map((ex) => {
                            const isSelected = selected.includes(ex.id);
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => toggle(ex.id)}
                                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-lg backdrop-blur-lg transition ${
                                        isSelected
                                            ? "border-purple-400 bg-purple-500/30"
                                            : "border-white/20 bg-white/10 hover:border-purple-300"
                                    }`}
                                >
                                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                                        <img
                                            src={IMAGE_BASE_URL + ex.thumbnailUrl}
                                            alt={ex.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1 text-white">
                                        <div className="truncate text-lg font-semibold">{ex.name}</div>
                                        <div className="mt-1 text-sm text-purple-200">{ex.targetMuscle}</div>
                                        <p className="mt-1 text-xs text-gray-200/80">
                                            {ex.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
                <button
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleNext}
                    disabled={selected.length === 0}
                >
                    {selected.length > 0 ? `운동 ${selected.length}개 선택 완료` : "운동 선택"}
                </button>
            </div>
        </Layout>
    );
}