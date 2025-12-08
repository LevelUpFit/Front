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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-xl text-white">운동 추가</span>
                    <button 
                        onClick={onClose} 
                        className="text-2xl text-gray-400 hover:text-white transition"
                    >
                        ×
                    </button>
                </div>
                <input
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                    placeholder="운동명 또는 부위로 검색"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="max-h-72 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
                    {filtered.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">검색 결과가 없습니다</div>
                    ) : (
                        filtered.map((ex) => (
                            <div 
                                key={ex.id} 
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                                    selected.includes(ex.id) 
                                        ? 'bg-purple-600/30 border border-purple-500' 
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                                onClick={() => toggle(ex.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(ex.id)}
                                    onChange={() => toggle(ex.id)}
                                    className="w-5 h-5 rounded accent-purple-500"
                                />
                                <img 
                                    src={ex.thumbnailUrl} 
                                    alt={ex.name} 
                                    className="w-12 h-12 object-contain rounded-lg bg-white/10"
                                />
                                <div>
                                    <div className="font-semibold text-white">{ex.name}</div>
                                    <div className="text-xs text-purple-300">{ex.targetMuscle}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl py-3 font-bold mt-4 shadow-lg hover:scale-[1.02] transition transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    onClick={() => onAdd(selected)}
                    disabled={selected.length === 0}
                >
                    {selected.length > 0 ? `운동 ${selected.length}개 추가` : '운동을 선택하세요'}
                </button>
            </div>
        </div>
    );
}