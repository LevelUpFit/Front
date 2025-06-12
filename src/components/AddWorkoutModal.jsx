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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-3"
            >
                <h2 className="font-bold text-lg mb-2">{initialData ? "운동 수정" : "운동 추가"} - {date}</h2>
                <div>
                    <label className="block text-sm mb-1">날짜</label>
                    <input
                        type="text"
                        value={date}
                        readOnly
                        className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">운동 이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded px-2 py-1"
                        placeholder="운동 목록(쉼표로 구분, 예: 스쿼트, 벤치프레스, 데드리프트)"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">타겟 근육</label>
                    <input
                        type="text"
                        value={targetMuscle}
                        onChange={(e) => setTargetMuscle(e.target.value)}
                        required
                        className="w-full border rounded px-2 py-1"
                        placeholder="예: 하체, 등, 가슴 등"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">피드백</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="운동 후 느낀 점이나 기록을 입력하세요"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white rounded py-2 font-bold">
                        저장
                    </button>
                    <button type="button" className="flex-1 bg-gray-300 rounded py-2 font-bold" onClick={onClose}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
