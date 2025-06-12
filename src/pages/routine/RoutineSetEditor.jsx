import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ExerciseSelectModal from "./ExerciseSelectModal";
import { createRoutinesExercise } from "../../api/routine";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function RoutineSetEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, targetMuscle, exercises = [], routineId, thumbnailUrl } = location.state || {};

    // 최초 진입 시 모달 자동 오픈
    const [showModal, setShowModal] = useState(true);

    // 운동 세트 상태
    const [exerciseSets, setExerciseSets] = useState(
        exercises.map(ex => ({
            ...ex,
            sets: [{ weight: "", reps: "" }],
        }))
    );

    // 운동 추가/제거(모달에서 선택된 운동만 반영)
    const handleAddExercises = (selectedExercises) => {
        setExerciseSets(prev => {
            // 이미 선택된 운동 id
            const selectedIds = selectedExercises.map(ex => ex.id);
            // 선택된 운동만 남기고, 새로 추가된 운동은 세트 1개로 추가
            const filtered = prev.filter(ex => selectedIds.includes(ex.id));
            const newOnes = selectedExercises.filter(ex => !prev.some(e => e.id === ex.id))
                .map(ex => ({ ...ex, sets: [{ weight: "", reps: "" }] }));
            return [...filtered, ...newOnes];
        });
        setShowModal(false);
    };

    const handleSetChange = (exIdx, setIdx, field, value) => {
        setExerciseSets(prev =>
            prev.map((ex, i) =>
                i === exIdx
                    ? {
                        ...ex,
                        sets: ex.sets.map((set, j) =>
                            j === setIdx ? { ...set, [field]: value } : set
                        ),
                    }
                    : ex
            )
        );
    };

    const handleAddSet = (exIdx) => {
        setExerciseSets(prev =>
            prev.map((ex, i) =>
                i === exIdx
                    ? { ...ex, sets: [...ex.sets, { weight: "", reps: "" }] }
                    : ex
            )
        );
    };

    const handleRemoveSet = (exIdx, setIdx) => {
        setExerciseSets(prev =>
            prev.map((ex, i) =>
                i === exIdx
                    ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) }
                    : ex
            )
        );
    };

    const handleSave = async () => {
        // routineId는 location.state에서 받아옴
        const routineExercises = exerciseSets.map((ex, idx) => ({
            routineId,
            exerciseId: ex.id,
            sets: ex.sets.length,
            reps: ex.sets.map(set => Number(set.reps)),   // 각 세트의 반복수 배열
            weight: ex.sets.map(set => Number(set.weight)), // 각 세트의 무게 배열
            restTime: 60, // 필요시 입력값으로 변경
            exerciseOrder: idx + 1,
        }));

        try {
            await createRoutinesExercise(routineExercises);
            alert("루틴 저장 완료!");
            navigate("/routine");
        } catch (e) {
            alert("저장 실패");
        }
    };

    return (
        <div className="min-h-screen bg-white px-4 py-6">
            {/* 상단 루틴 정보 */}
            <div className="flex items-center gap-4 mb-6">
                {thumbnailUrl && (
                    <img
                        src={thumbnailUrl}
                        alt="루틴 썸네일"
                        className="w-16 h-16 object-contain rounded-full bg-gray-100"
                    />
                )}
                <div>
                    <div className="text-xl font-bold">{name || "루틴 이름"}</div>
                    {targetMuscle && (
                        <div className="text-blue-600 font-semibold">{targetMuscle}</div>
                    )}
                </div>
            </div>
            {exerciseSets.map((ex, exIdx) => (
                <div key={ex.id} className="mb-8 bg-white rounded-3xl shadow p-0 overflow-hidden">
                    {/* 상단: 이미지와 운동명 */}
                    <div className="flex items-center gap-4 bg-white px-6 pt-6 pb-2">
                        <img
                            src={IMAGE_BASE_URL + ex.thumbnailUrl}
                            alt={ex.name}
                            className="w-28 h-28 object-contain"
                            style={{ background: "#f3f3f3", borderRadius: 16 }}
                        />
                        <div>
                            <div className="font-bold text-2xl mb-1">{ex.name}</div>
                            <div className="text-gray-600 text-lg">{ex.targetMuscle}</div>
                        </div>
                    </div>
                    {/* 세트 입력 */}
                    <div className="px-3 pb-6 pt-2">
                        {ex.sets.map((set, setIdx) => (
                            <div
                                key={setIdx}
                                className="flex items-center mb-3 bg-gray-200 rounded-2xl px-4 py-2 gap-2"
                            >
                                <span className="w-6 text-center font-bold text-lg">{setIdx + 1}</span>
                                <input
                                    type="number"
                                    value={set.weight}
                                    onChange={e => handleSetChange(exIdx, setIdx, "weight", e.target.value)}
                                    className="w-14 text-center font-bold rounded-xl bg-gray-300 border-none outline-none py-1 mx-1"
                                    style={{ fontSize: "1.1rem" }}
                                />
                                <span className="font-bold text-lg mx-1">KG</span>
                                <input
                                    type="number"
                                    value={set.reps}
                                    onChange={e => handleSetChange(exIdx, setIdx, "reps", e.target.value)}
                                    className="w-12 text-center font-bold rounded-xl bg-gray-300 border-none outline-none py-1 mx-1"
                                    style={{ fontSize: "1.1rem" }}
                                />
                                <span className="font-bold text-lg mx-1">회</span>
                                {setIdx > 0 && (
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-500 hover:text-red-500 font-bold text-xl px-2"
                                        onClick={() => handleRemoveSet(exIdx, setIdx)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            className="w-full bg-gray-200 rounded-2xl py-3 mt-2 font-bold text-lg text-gray-700"
                            onClick={() => handleAddSet(exIdx)}
                        >
                            + 세트 추가
                        </button>
                    </div>
                </div>
            ))}
            <button
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold mt-6 text-lg"
                onClick={() => setShowModal(true)}
            >
                운동 추가
            </button>
            {showModal && (
                <ExerciseSelectModal
                    onClose={() => setShowModal(false)}
                    onSelect={handleAddExercises}
                    alreadySelected={exerciseSets.map(ex => ex.id)}
                    initialSelected={exerciseSets.map(ex => ex.id)}
                    heightPercent={80} // 80% 높이 전달
                />
            )}
            <button
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold mt-6 text-lg"
                onClick={handleSave}
            >
                저장
            </button>
        </div>
    );
}