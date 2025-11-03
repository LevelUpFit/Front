import { useEffect, useState } from "react";
import { getAllExercises } from "../../api/exercise";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const muscleOptions = [
    { label: "전체", value: "" },
    { label: "등", value: "등" },
    { label: "가슴", value: "가슴" },
    { label: "어깨", value: "어깨" },
    { label: "하체", value: "하체" },
    { label: "복근", value: "복근" },
    // 필요시 추가
];

export default function ExerciseSelectModal({
    onClose,
    onSelect,
    alreadySelected = [],
    initialSelected = [],
    heightPercent = 80
}) {
    const [exercises, setExercises] = useState([]);
    const [selected, setSelected] = useState(initialSelected);
    const [filter, setFilter] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        getAllExercises().then(res => {
            if (res.data && res.data.success) setExercises(res.data.data);
        });
    }, []);

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };

    const handleAdd = () => {
        const selectedExercises = exercises.filter(ex => selected.includes(ex.id));
        onSelect(selectedExercises);
    };

    // 필터링된 운동 목록
    const filteredExercises = filter
        ? exercises.filter(ex => ex.targetMuscle === filter)
        : exercises;

    // 모달 높이 계산 (최대 80vh, 내용이 적으면 자동으로 줄어듦)
    const modalMaxHeight = `${heightPercent}vh`;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="flex w-full max-w-md flex-col rounded-t-3xl border border-white/20 bg-gray-900/95 p-5 shadow-2xl animate-slide-up"
                style={{ maxHeight: modalMaxHeight }}
            >
                <div className="mb-4 flex items-center justify-between text-white">
                    <span className="text-lg font-bold">운동 추가</span>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-gray-200 transition hover:bg-white/20"
                    >
                        닫기
                    </button>
                </div>
                {/* 부위별 필터 콤보박스 */} 
                <div className="relative mb-3">
                    <button
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-purple-300"
                        onClick={() => setShowDropdown(v => !v)}
                    >
                        {muscleOptions.find(opt => opt.value === filter)?.label || "전체"}
                        <span className="float-right text-xs text-purple-200">▼</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute left-0 right-0 z-10 mt-2 max-h-48 overflow-y-auto rounded-xl border border-white/20 bg-gray-900/95 shadow-lg">
                            {muscleOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    className={`px-4 py-2 text-sm text-gray-200 transition hover:bg-white/10 ${
                                        filter === opt.value ? "text-purple-300" : ""
                                    }`}
                                    onClick={() => {
                                        setFilter(opt.value);
                                        setShowDropdown(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div
                    className="flex-1 overflow-y-auto"
                    style={{ maxHeight: `calc(${modalMaxHeight} - 150px)` }}
                >
                    {filteredExercises.length === 0 ? (
                        <div className="py-10 text-center text-gray-400">
                            운동이 없습니다.
                        </div>
                    ) : (
                        filteredExercises.map(ex => {
                            const isSelected = selected.includes(ex.id);
                            return (
                                <div
                                    key={ex.id}
                                    className={`mb-3 flex items-center gap-4 rounded-2xl border px-5 py-4 transition ${
                                        isSelected
                                            ? "border-purple-400 bg-purple-500/30"
                                            : "border-white/15 bg-white/5 hover:border-purple-300"
                                    } cursor-pointer`}
                                    style={{
                                        borderWidth: isSelected ? 2 : 1,
                                    }}
                                    onClick={() => toggle(ex.id)}
                                >
                                    <img
                                        src={IMAGE_BASE_URL + ex.thumbnailUrl}
                                        alt={ex.name}
                                        className="h-20 w-20 rounded-2xl border border-white/10 bg-black/10 object-cover"
                                    />
                                    <div className="flex-1 text-white">
                                        <div className="text-lg font-semibold">{ex.name}</div>
                                        <div className="text-sm text-purple-200">{ex.targetMuscle}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <button
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-base font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleAdd}
                    disabled={selected.length === 0}
                >
                    운동 {selected.length}개 추가
                </button>
            </div>
            <style>
            {`
            @keyframes slide-up {
              from { transform: translateY(100%);}
              to { transform: translateY(0);}
            }
            .animate-slide-up {
              animation: slide-up 0.3s cubic-bezier(.4,0,.2,1);
            }
            `}
            </style>
        </div>
    );
}
