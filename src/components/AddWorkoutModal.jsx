import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import { saveExerciseLog } from "../api/exercise";

export default function AddWorkoutModal({ date, onClose, onSave, initialData }) {
    const [name, setName] = useState("");
    const [targetMuscle, setTargetMuscle] = useState("");
    const [feedback, setFeedback] = useState("");
    const { getUserId } = useUserStore();

    // 초기값 설정
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setTargetMuscle(initialData.targetMuscle || "");
            setFeedback(initialData.feedback || "");
        } else {
            setName("");
            setTargetMuscle("");
            setFeedback("");
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserId();
        const newWorkout = {
            userId,
            name,
            targetMuscle,
            feedback,
            performedDate: date,
        };
        try {
            await saveExerciseLog(newWorkout);
            onSave(newWorkout); // 부모에서 상태 업데이트
            onClose();
        } catch (err) {
            alert("운동 기록 저장에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 border border-white/20"
            >
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-xl text-white">
                        {initialData ? "운동 수정" : "운동 추가"}
                    </h2>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="text-2xl text-gray-400 hover:text-white transition"
                    >
                        ×
                    </button>
                </div>
                
                <div className="text-sm text-purple-300 mb-2">📅 {date}</div>
                
                <div>
                    <label className="block text-sm text-gray-300 mb-2">운동 이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                        placeholder="예: 스쿼트, 벤치프레스, 데드리프트"
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-300 mb-2">타겟 근육</label>
                    <input
                        type="text"
                        value={targetMuscle}
                        onChange={(e) => setTargetMuscle(e.target.value)}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                        placeholder="예: 하체, 등, 가슴"
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-300 mb-2">메모</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition resize-none h-24"
                        placeholder="운동 후 느낌 점이나 기록을 입력하세요"
                    />
                </div>
                
                <div className="flex gap-3 mt-2">
                    <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl py-3 font-bold shadow-lg hover:scale-[1.02] transition transform"
                    >
                        저장
                    </button>
                    <button 
                        type="button" 
                        className="flex-1 bg-white/10 border border-white/20 text-gray-300 rounded-xl py-3 font-bold hover:bg-white/20 transition" 
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
