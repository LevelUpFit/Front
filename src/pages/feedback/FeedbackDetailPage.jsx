import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getExerciseById } from "../../api/exercise";

export default function FeedbackDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const feedback = location.state?.feedback;
    const [exerciseName, setExerciseName] = useState("");
    const [showVideo, setShowVideo] = useState(false);

    // 운동 id로 운동 이름 받아오기
    useEffect(() => {
        async function fetchExerciseName() {
            if (feedback?.exerciseId) {
                try {
                    const res = await getExerciseById(feedback.exerciseId);
                    setExerciseName(res.data.data?.name || feedback.exerciseId);
                } catch {
                    setExerciseName(feedback.exerciseId);
                }
            }
        }
        fetchExerciseName();
    }, [feedback]);

    if (!feedback) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <p className="text-lg text-gray-500 mb-4">피드백 정보를 찾을 수 없습니다.</p>
                    <button
                        className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow"
                        onClick={() => navigate(-1)}
                    >
                        돌아가기
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
                <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">피드백 상세</h1>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="font-semibold w-24 text-gray-700">운동명</span>
                        <span className="ml-2 text-gray-900">{exerciseName}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-24 text-gray-700">수행일자</span>
                        <span className="ml-2 text-gray-900">{feedback.performedDate}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-24 text-gray-700">정확도</span>
                        <span className="ml-2 text-gray-900">
                            {feedback.accuracy ? `${feedback.accuracy.toFixed(2)}%` : "-"}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">피드백</span>
                        <div className="mt-1 p-3 bg-gray-50 rounded text-gray-800 min-h-[48px]">
                            {feedback.feedbackText || "없음"}
                        </div>
                    </div>
                    {feedback.videoUrl && (
                        <div className="mt-4">
                            {!showVideo ? (
                                <button
                                    className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold shadow"
                                    onClick={() => setShowVideo(true)}
                                >
                                    동영상 보기 ▾
                                </button>
                            ) : (
                                <div>
                                    <video
                                        src={feedback.videoUrl}
                                        controls
                                        className="w-full rounded-lg border border-gray-200 shadow"
                                    />
                                    <button
                                        className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold shadow"
                                        onClick={() => setShowVideo(false)}
                                    >
                                        동영상 닫기 ▴
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button
                    className="mt-8 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold shadow transition"
                    onClick={() => navigate(-1)}
                >
                    목록으로
                </button>
            </div>
        </Layout>
    );
}