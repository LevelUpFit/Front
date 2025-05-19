import { useState } from "react";
import useUserStore from "../stores/userStore";
import BackButton from "../components/BackButton";

export default function FeedbackPage() {
    const { workoutsByDate } = useUserStore();
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const feedbackEntries = Object.entries(workoutsByDate)
        .filter(([_, data]) => data.feedback && data.feedback.trim() !== "")
        .sort(([a], [b]) => new Date(b) - new Date(a));

    return (
        <div className="p-4 space-y-4 min-h-screen bg-gray-100">
            <BackButton />
            <h1 className="text-xl font-bold mb-4 ml-8">운동 피드백</h1>

            {feedbackEntries.length === 0 ? (
                <p className="text-gray-500 text-center">아직 피드백이 없습니다.</p>
            ) : (
                feedbackEntries.map(([date, { part, feedback }]) => (
                    <div
                        key={date}
                        className="p-4 border rounded shadow bg-white cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedFeedback({ date, part, feedback })}
                    >
                        <h2 className="font-semibold mb-1">{date}</h2>
                        <p className="text-gray-800">{part}</p>
                    </div>
                ))
            )}

            {/* ✅ 피드백 모달 */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-2">{selectedFeedback.date}</h2>
                        <p className="text-gray-700 mb-2">
                            <strong>운동 부위:</strong> {selectedFeedback.part}
                        </p>
                        <p className="text-gray-600 whitespace-pre-wrap">{selectedFeedback.feedback}</p>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
