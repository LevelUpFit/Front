import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ExerciseSelectModal from "./ExerciseSelectModal";
import { createRoutinesExercise } from "../../api/routine";
import { getRoutineExercises, patchRoutinesExercise, getAllExercises } from "../../api/exercise";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// StrictModeDroppable 컴포넌트 추가
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function RoutineSetEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, targetMuscle, exercises = [], routineId, thumbnailUrl } = location.state || {};

    // 최초 진입 시 모달 자동 오픈 (생성일 때만 true, 수정일 때는 false)
    const [showModal, setShowModal] = useState(!routineId);

    // 운동 세트 상태 [{exerciseId, name, ... , sets: [{weight, reps}, ...]}]
    const [exerciseSets, setExerciseSets] = useState([]);
    // 모달에서 선택된 운동 id 목록
    const [alreadySelected, setAlreadySelected] = useState([]);

    // 전체 운동 목록 (id, name, targetMuscle, thumbnailUrl 등)
    const [allExercises, setAllExercises] = useState([]);

    // 전체 운동 목록 불러오기 (최초 1회)
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await getAllExercises();
                if (res.data && res.data.success) {
                    setAllExercises(res.data.data);
                }
            } catch (e) {
                    setAllExercises([]);
            }
        };
        fetchAll();
    }, []);

    // 루틴에 이미 저장된 운동 정보가 있으면 불러오기 (수정 모드)
    useEffect(() => {
        const fetchRoutineExercises = async () => {
            if (!routineId) {
                // 생성 모드: props로 받은 exercises로 초기화
                setExerciseSets(
                    exercises.map(ex => ({
                        ...ex,
                        exerciseId: ex.id,
                        routineExerciseId: null, // 새 운동이므로 null
                        sets: [{ weight: "", reps: "" }],
                    }))
                );
                setAlreadySelected(exercises.map(ex => ex.id));
                return;
            }
            try {
                const res = await getRoutineExercises(routineId);
                if (res.data && res.data.success && res.data.data.length > 0) {
                    const routineExerciseList = res.data.data;
                    // 전체 운동 목록에서 카드 정보 매칭
                    const setsArr = routineExerciseList.map(routineEx => {
                        const exInfo = allExercises.find(e => e.id === routineEx.exerciseId) || {};
                        return {
                            ...exInfo,
                            exerciseId: routineEx.exerciseId,
                            routineExerciseId: routineEx.id, // 기존 운동이면 id 저장
                            sets: (routineEx.reps || []).map((reps, idx) => ({
                                reps: reps,
                                weight: routineEx.weight && routineEx.weight[idx] !== undefined ? routineEx.weight[idx] : "",
                            })),
                        };
                    });
                    setExerciseSets(setsArr);
                    setAlreadySelected(routineExerciseList.map(ex => ex.exerciseId));
                }
            } catch (e) {
                setExerciseSets([]);
                setAlreadySelected([]);
            }
        };
        fetchRoutineExercises();
        // eslint-disable-next-line
    }, [routineId, allExercises.length]);

    // 운동 추가/제거(모달에서 선택된 운동만 반영)
    const handleAddExercises = (selectedExercises) => {
        setExerciseSets(prev => {
            const selectedIds = selectedExercises.map(ex => ex.id);
            // 기존 운동은 routineExerciseId 유지, 새 운동은 null
            const filtered = prev.filter(ex => selectedIds.includes(ex.exerciseId));
            const newOnes = selectedExercises
                .filter(ex => !prev.some(e => e.exerciseId === ex.id))
                .map(ex => ({
                    ...ex,
                    exerciseId: ex.id,
                    routineExerciseId: null,
                    sets: [{ weight: "", reps: "" }]
                }));
            return [...filtered, ...newOnes];
        });
        setAlreadySelected(selectedExercises.map(ex => ex.id));
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

    // 드래그 시 순서 변경
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = Array.from(exerciseSets);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        setExerciseSets(reordered);
    };

    // 저장/수정 분기
    const handleSave = async () => {
        // 기존 루틴-운동 정보 불러오기
        let existingRoutineExerciseList = [];
        try {
            const res = await getRoutineExercises(routineId);
            if (res.data && res.data.success) {
                existingRoutineExerciseList = res.data.data;
            }
        } catch (e) {
            // 무시
        }

        // 현재 입력된 운동 정보
        const currentList = exerciseSets.map((ex, idx) => ({
            id: ex.routineExerciseId, // 기존 운동이면 id, 새 운동이면 null
            routineId,
            exerciseId: ex.exerciseId,
            sets: ex.sets.length,
            reps: ex.sets.map(set => Number(set.reps)),
            weight: ex.sets.map(set => Number(set.weight)), // weight 배열로!
            restTime: 60,
            exerciseOrder: idx + 1,
        }));

        // PATCH용: 기존에 있던 운동만
        const patchList = currentList.filter(ex => ex.id);
        // CREATE용: 새로 추가된 운동만
        const createList = currentList.filter(ex => !ex.id);

        try {
            await patchRoutinesExercise({
                existingRoutineExerciseList: patchList,
                newRoutineExerciseList: createList,
            });
            alert("루틴 저장 완료!");
            navigate("/routine");
        } catch (e) {
            alert("저장 실패");
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f8] px-4 py-6">
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
            {/* 드래그 앤 드롭 영역 */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <StrictModeDroppable droppableId="exercise-list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {exerciseSets.map((ex, exIdx) => (
                                <Draggable key={ex.exerciseId} draggableId={String(ex.exerciseId)} index={exIdx}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`mb-8 bg-white rounded-3xl border border-gray-200 ${
                                                snapshot.isDragging ? "ring-2 ring-blue-400" : "shadow"
                                            } p-0`}
                                        >
                                            {/* 상단: 이미지와 운동명 + 햄버거 드래그 핸들 */}
                                            <div className="flex items-center gap-4 bg-white px-6 pt-6 pb-2 rounded-t-3xl relative border-b border-gray-100">
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
                                                {/* 햄버거 드래그 핸들 (우측 상단) */}
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="absolute top-4 right-4 cursor-grab active:cursor-grabbing"
                                                    style={{ padding: 8 }}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <rect y="4" width="24" height="2" rx="1" fill="#888" />
                                                        <rect y="11" width="24" height="2" rx="1" fill="#888" />
                                                        <rect y="18" width="24" height="2" rx="1" fill="#888" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* 세트 입력 */}
                                            <div className="px-3 pb-6 pt-2">
                                                {ex.sets.map((set, setIdx) => (
                                                    <div
                                                        key={setIdx}
                                                        className="flex items-center mb-3 bg-gray-100 rounded-2xl px-4 py-2 gap-2 border border-gray-200"
                                                    >
                                                        <span className="w-6 text-center font-bold text-lg">{setIdx + 1}</span>
                                                        <input
                                                            type="number"
                                                            value={set.weight}
                                                            onChange={e => handleSetChange(exIdx, setIdx, "weight", e.target.value)}
                                                            className="w-14 text-center font-bold rounded-xl bg-gray-200 border-none outline-none py-1 mx-1"
                                                            style={{ fontSize: "1.1rem" }}
                                                        />
                                                        <span className="font-bold text-lg mx-1">KG</span>
                                                        <input
                                                            type="number"
                                                            value={set.reps}
                                                            onChange={e => handleSetChange(exIdx, setIdx, "reps", e.target.value)}
                                                            className="w-12 text-center font-bold rounded-xl bg-gray-200 border-none outline-none py-1 mx-1"
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
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
            <button
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold mt-6 text-lg shadow"
                onClick={() => setShowModal(true)}
            >
                운동 추가
            </button>
            {showModal && (
                <ExerciseSelectModal
                    onClose={() => setShowModal(false)}
                    onSelect={handleAddExercises}
                    alreadySelected={alreadySelected}
                    initialSelected={alreadySelected}
                    heightPercent={80}
                />
            )}
            <button
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold mt-6 text-lg shadow"
                onClick={handleSave}
            >
                저장
            </button>
        </div>
    );
}