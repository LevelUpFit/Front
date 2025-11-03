import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ExerciseSelectModal from "./ExerciseSelectModal";
import { getRoutineExercises, patchRoutinesExercise, getAllExercises } from "../../api/exercise";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Layout from "../../components/Layout";

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
                        routineExerciseId: null,
                        sets: [{ weight: "", reps: "" }],
                    }))
                );
                setAlreadySelected(exercises.map(ex => ex.id));
                return;
            }
            try {
                const res = await getRoutineExercises(routineId);
                if (res.data && res.data.success && res.data.data.length > 0) {
                    const routineExerciseList = res.data.data
                        .slice() // 복사본 생성
                        .sort((a, b) => (a.exerciseOrder || 0) - (b.exerciseOrder || 0)); // order순 정렬

                    const setsArr = routineExerciseList.map(routineEx => {
                        const exInfo = allExercises.find(e => e.id === routineEx.exerciseId) || {};
                        return {
                            ...exInfo,
                            exerciseId: routineEx.exerciseId,
                            routineExerciseId: routineEx.id,
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
        // 저장 시, 드래그로 바뀐 순서대로 exerciseOrder를 재설정
        const currentList = exerciseSets.map((ex, idx) => ({
            id: ex.routineExerciseId,
            routineId,
            exerciseId: ex.exerciseId,
            sets: ex.sets.length,
            reps: ex.sets.map(set => Number(set.reps)),
            weight: ex.sets.map(set => Number(set.weight)),
            restTime: 60,
            exerciseOrder: idx + 1, // 순서대로 재설정
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
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-lg">
                    {thumbnailUrl && (
                        <img
                            src={thumbnailUrl}
                            alt="루틴 썸네일"
                            className="h-16 w-16 rounded-full border border-white/20 object-cover"
                        />
                    )}
                    <div>
                        <div className="text-xl font-bold">{name || "루틴 이름"}</div>
                        {targetMuscle && <div className="text-sm text-purple-200">{targetMuscle}</div>}
                    </div>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <StrictModeDroppable droppableId="exercise-list">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                                {exerciseSets.map((ex, exIdx) => (
                                    <Draggable key={ex.exerciseId} draggableId={String(ex.exerciseId)} index={exIdx}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-lg transition ${
                                                    snapshot.isDragging ? "ring-2 ring-purple-400" : ""
                                                }`}
                                            >
                                                <div className="relative flex items-center gap-4 border-b border-white/10 bg-white/5 px-6 pb-4 pt-6 text-white">
                                                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                                                        <img
                                                            src={IMAGE_BASE_URL + ex.thumbnailUrl}
                                                            alt={ex.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-2xl font-bold">{ex.name}</div>
                                                        <div className="text-sm text-purple-200">{ex.targetMuscle}</div>
                                                    </div>
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="absolute right-4 top-4 cursor-grab rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20 active:cursor-grabbing"
                                                    >
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                                            <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
                                                            <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
                                                            <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 px-4 py-5">
                                                    {ex.sets.map((set, setIdx) => (
                                                        <div
                                                            key={setIdx}
                                                            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white"
                                                        >
                                                            <span className="w-6 text-center text-lg font-bold">{setIdx + 1}</span>
                                                            <input
                                                                type="number"
                                                                value={set.weight}
                                                                onChange={(e) => handleSetChange(exIdx, setIdx, "weight", e.target.value)}
                                                                className="w-16 rounded-xl border border-white/10 bg-black/30 px-2 py-2 text-center text-base font-semibold text-white focus:border-purple-400 focus:outline-none"
                                                            />
                                                            <span className="text-sm font-semibold">KG</span>
                                                            <input
                                                                type="number"
                                                                value={set.reps}
                                                                onChange={(e) => handleSetChange(exIdx, setIdx, "reps", e.target.value)}
                                                                className="w-14 rounded-xl border border-white/10 bg-black/30 px-2 py-2 text-center text-base font-semibold text-white focus:border-purple-400 focus:outline-none"
                                                            />
                                                            <span className="text-sm font-semibold">회</span>
                                                            {setIdx > 0 && (
                                                                <button
                                                                    type="button"
                                                                    className="ml-auto rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-gray-200 transition hover:bg-red-500/40"
                                                                    onClick={() => handleRemoveSet(exIdx, setIdx)}
                                                                >
                                                                    삭제
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="w-full rounded-2xl border border-dashed border-purple-300 bg-purple-500/10 py-3 text-sm font-semibold text-purple-100 transition hover:bg-purple-500/20"
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
                <div className="space-y-3">
                    <button
                        className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                        onClick={() => setShowModal(true)}
                    >
                        운동 추가
                    </button>
                    <button
                        className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
                {showModal && (
                    <ExerciseSelectModal
                        onClose={() => setShowModal(false)}
                        onSelect={handleAddExercises}
                        alreadySelected={alreadySelected}
                        initialSelected={alreadySelected}
                        heightPercent={80}
                    />
                )}
            </div>
        </Layout>
    );
}