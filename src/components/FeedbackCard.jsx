import { useNavigate } from "react-router-dom";

export default function FeedbackCard({ feedback }) {
    const navigate = useNavigate();

    return (
        <div
            className="bg-blue-100 p-4 rounded-lg shadow cursor-pointer"
            onClick={() => navigate("/feedback")}
        >
            <h2 className="text-lg font-bold mb-1">오늘의 피드백</h2>
            <p className="text-sm text-gray-700 truncate">{feedback || "피드백이 없습니다."}</p>
            <p className="text-xs text-right text-blue-600 mt-1">상세보기 ▸</p>
        </div>
    );
}
