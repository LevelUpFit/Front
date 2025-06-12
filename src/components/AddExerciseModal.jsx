import { useState } from "react";

export default function AddExerciseModal({ exercises, onClose, onAdd }) {
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");

    // 검색 필터
    const filtered = exercises.filter(
        (ex) =>
            ex.name.includes(search) ||
            ex.targetMuscle.includes(search)
    );

    const toggle = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">운동 추가</span>
                    <button onClick={onClose} className="text-2xl">×</button>
                </div>
                <input
                    className="w-full border rounded px-2 py-1 mb-3"
                    placeholder="검색"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="max-h-72 overflow-y-auto space-y-2">
                    {filtered.map((ex) => (
                        <div key={ex.id} className="flex items-center gap-2 border-b py-2">
                            <input
                                type="checkbox"
                                checked={selected.includes(ex.id)}
                                onChange={() => toggle(ex.id)}
                            />
                            <img src={ex.thumbnailUrl} alt={ex.name} className="w-10 h-10 object-contain" />
                            <div>
                                <div className="font-semibold">{ex.name}</div>
                                <div className="text-xs text-gray-500">{ex.targetMuscle}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="w-full bg-blue-600 text-white rounded py-2 font-bold mt-4"
                    onClick={() => onAdd(selected)}
                    disabled={selected.length === 0}
                >
                    운동 {selected.length}개 추가
                </button>
            </div>
        </div>
    );
}