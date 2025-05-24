import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";

export default function AddWorkoutModal({ date, initialData, onClose }) {
    const setWorkoutByDate = useUserStore((state) => state.setWorkoutByDate);

    const [part, setPart] = useState("");
    const [routine, setRoutine] = useState("");
    const [feedback, setFeedback] = useState("");

    // 초기값 설정
    useEffect(() => {
        if (initialData) {
            setPart(initialData.part || "");
            setRoutine((initialData.routine || []).join(", "));
            setFeedback(initialData.feedback || "");
        }
    }, [initialData]);

    const handleSave = () => {
        const newWorkout = {
            part,
            routine: routine.split(",").map((item) => item.trim()),
            feedback,
        };
        setWorkoutByDate(date, newWorkout);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">{initialData ? "운동 수정" : "운동 추가"} - {date}</h2>

                <input
                    type="text"
                    placeholder="운동 부위"
                    className="w-full border px-3 py-2 rounded mb-2"
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="운동 목록 (쉼표로 구분)"
                    className="w-full border px-3 py-2 rounded mb-2"
                    value={routine}
                    onChange={(e) => setRoutine(e.target.value)}
                />
                <textarea
                    placeholder="피드백"
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
