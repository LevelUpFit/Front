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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-end">
            <div
                className="w-full max-w-md bg-white rounded-t-2xl p-4 shadow-lg animate-slide-up flex flex-col"
                style={{ maxHeight: modalMaxHeight }}
            >
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">운동 추가</span>
                    <button onClick={onClose}>✕</button>
                </div>
                {/* 부위별 필터 콤보박스 */} 
                <div className="mb-3 relative">
                    <button
                        className="w-full border rounded-lg px-3 py-2 text-left bg-gray-50"
                        onClick={() => setShowDropdown(v => !v)}
                    >
                        {muscleOptions.find(opt => opt.value === filter)?.label || "전체"}
                        <span className="float-right">&#9660;</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute left-0 right-0 bg-white border rounded-lg mt-1 z-10 max-h-48 overflow-y-auto">
                            {muscleOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${filter === opt.value ? "font-bold text-blue-600" : ""}`}
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
                    className="overflow-y-auto flex-1"
                    style={{ maxHeight: `calc(${modalMaxHeight} - 150px)` }}
                >
                    {filteredExercises.length === 0 ? (
                        <div
                            className="text-center text-gray-400 py-10"
                        >
                            운동이 없습니다.
                        </div>
                    ) : (
                        filteredExercises.map(ex => {
                            const isSelected = selected.includes(ex.id);
                            return (
                                <div
                                    key={ex.id}
                                    className={`flex items-center gap-4 py-5 px-5 mb-3 rounded-lg cursor-pointer transition-colors
                                        ${isSelected ? "bg-blue-100 border border-blue-400" : "bg-gray-50 border"}
                                    `}
                                    style={{
                                        borderWidth: isSelected ? 2 : 1,
                                    }}
                                    onClick={() => toggle(ex.id)}
                                >
                                    <img
                                        src={IMAGE_BASE_URL + ex.thumbnailUrl}
                                        alt={ex.name}
                                        className="w-24 h-24 object-contain"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-lg">{ex.name}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <button
                    className="w-full bg-blue-600 text-white rounded py-3 font-bold mt-4"
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
