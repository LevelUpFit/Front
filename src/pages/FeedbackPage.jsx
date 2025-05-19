import useUserStore from "../stores/userStore";

export default function FeedbackPage() {
    const { workoutsByDate } = useUserStore();

    const feedbackEntries = Object.entries(workoutsByDate)
        .filter(([_, data]) => data.feedback && data.feedback.trim() !== "")
        .sort(([a], [b]) => new Date(b) - new Date(a)); // 최신순 정렬

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold mb-4">운동 피드백</h1>
            {feedbackEntries.length === 0 ? (
                <p className="text-gray-500">아직 피드백이 없습니다.</p>
            ) : (
                feedbackEntries.map(([date, { feedback }]) => (
                    <div key={date} className="p-4 border rounded shadow bg-white">
                        <h2 className="font-semibold mb-1">{date}</h2>
                        <p>{feedback}</p>
                    </div>
                ))
            )}
        </div>
    );
}
