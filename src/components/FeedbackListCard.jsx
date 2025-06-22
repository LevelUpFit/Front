export default function FeedbackListCard({ feedback }) {
    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-2 shadow-sm">
            <div>
                <div className="font-semibold">{feedback.exercise}</div>
                {"accuracy" in feedback && feedback.accuracy !== undefined && feedback.accuracy !== null && (
                    <div className="text-xs text-gray-600 mt-1">
                        정확도: {Number(feedback.accuracy).toFixed(2)}%
                    </div>
                )}
                <div className="text-xs text-gray-500">{feedback.date}</div>
            </div>
            <div>
                {feedback.status === "pending" && (
                    <span className="text-blue-500 font-semibold text-sm">분석중</span>
                )}
                {feedback.status === "done" && (
                    <span className="text-green-500 font-semibold text-sm">완료</span>
                )}
                {feedback.status === "fail" && (
                    <span className="text-red-500 font-semibold text-sm">실패</span>
                )}
            </div>
        </div>
    );
}