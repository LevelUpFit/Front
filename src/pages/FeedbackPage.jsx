export default function FeedbackPage() {
    const feedbackData = {
        feedback: "팔을 완전히 펴지 않았어요. 자세를 교정하세요.",
        score: 78,
        poseImageUrl: "/images/sample.png",
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">운동 피드백</h1>

            <div className="bg-white p-4 rounded shadow">
                <p className="text-lg mb-2">점수: <span className="font-bold">{feedbackData.score}</span> / 100</p>
                <p className="text-gray-800">{feedbackData.feedback}</p>
                <img src={feedbackData.poseImageUrl} alt="분석 이미지" className="mt-4 rounded" />
            </div>
        </div>
    );
}
