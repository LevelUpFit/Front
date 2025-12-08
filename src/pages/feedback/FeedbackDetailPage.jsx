import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { getExerciseById } from "../../api/exercise";
import { getFeedbackById } from "../../api/feedback";

function FeedbackGraph({ feedback }) {
    const accuracy = typeof feedback.accuracy === "number" ? feedback.accuracy : 0;
    const movementRange = typeof feedback.movementRange === "number" ? feedback.movementRange : 0;
    const contractionPercent = feedback.movementSpeed?.contractionPercent;
    const relaxationPercent = feedback.movementSpeed?.relaxationPercent;
    const hasSpeed = typeof contractionPercent === "number" && typeof relaxationPercent === "number";
    const avgSpeedPercent = hasSpeed ? (contractionPercent + relaxationPercent) / 2 : 0;

    const graphData = useMemo(
        () => [
            { label: "정확도", value: accuracy, color: "bg-purple-500" },
            { label: "가동범위", value: movementRange, color: "bg-indigo-500" },
            ...(hasSpeed ? [{ label: "속도", value: avgSpeedPercent, color: "bg-pink-500" }] : []),
        ],
        [accuracy, movementRange, avgSpeedPercent, hasSpeed]
    );

    const heightFor = (value) => `${Math.max(12, value * 1.4)}px`;

    return (
        <div className="w-full py-6">
            <div className="flex items-end justify-around gap-6">
                {graphData.map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                        <div
                            className={`${item.color} w-9 rounded-t-lg transition-all duration-500`}
                            style={{ height: heightFor(item.value) }}
                        />
                        <span className="mt-3 text-sm font-semibold text-white">{item.label}</span>
                        <span className="text-xs text-gray-300">{item.value.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FeedbackDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { feedbackId } = useParams();
    const [feedback, setFeedback] = useState(location.state?.feedback || null);
    const [exerciseName, setExerciseName] = useState("");
    const [slideIndex, setSlideIndex] = useState(0);
    const [loading, setLoading] = useState(!location.state?.feedback);
    const touchStartX = useRef(null);

    // feedbackId로 데이터 조회
    useEffect(() => {
        async function fetchFeedback() {
            if (feedback) return; // 이미 state에 있으면 조회 안함
            if (!feedbackId) return;

            try {
                setLoading(true);
                const res = await getFeedbackById(feedbackId);
                if (res.data.success) {
                    setFeedback(res.data.data);
                }
            } catch (error) {
                console.error("피드백 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeedback();
    }, [feedbackId, feedback]);

    useEffect(() => {
        async function fetchExerciseName() {
            if (!feedback?.exerciseId) return;
            try {
                const res = await getExerciseById(feedback.exerciseId);
                setExerciseName(res.data.data?.name || feedback.exerciseId);
            } catch (error) {
                setExerciseName(feedback.exerciseId);
            }
        }
        fetchExerciseName();
    }, [feedback]);

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                    <p className="text-lg text-gray-300">피드백 데이터를 불러오는 중...</p>
                </div>
            </Layout>
        );
    }

    if (!feedback) {
        return (
            <Layout>
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                    <p className="text-lg text-gray-300">피드백 정보를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white shadow-lg"
                    >
                        돌아가기
                    </button>
                </div>
            </Layout>
        );
    }

    const handleSwipeStart = (event) => {
        touchStartX.current = event.touches ? event.touches[0].clientX : event.clientX;
    };

    const handleSwipeEnd = (event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
        const delta = endX - touchStartX.current;
        if (delta < -50 && slideIndex < 2) setSlideIndex((prev) => prev + 1);
        if (delta > 50 && slideIndex > 0) setSlideIndex((prev) => prev - 1);
        touchStartX.current = null;
    };

    const videoUrl = feedback.videoUrl;
    const accuracyText = typeof feedback.accuracy === "number" ? `${feedback.accuracy.toFixed(1)}%` : "-";

    const cardBase =
        "absolute inset-0 flex flex-col rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-opacity duration-300";

    const cardState = (index) => (slideIndex === index ? "z-20 opacity-100" : "z-10 opacity-0 pointer-events-none");

    const CardIndicator = () => (
        <div className="flex items-center justify-center gap-2 py-4">
            {[0, 1, 2].map((idx) => (
                <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                        slideIndex === idx ? "w-8 bg-gradient-to-r from-purple-500 to-indigo-500" : "w-4 bg-white/30"
                    }`}
                    aria-label={`슬라이드 ${idx + 1}`}
                />
            ))}
        </div>
    );

    return (
        <Layout>
            <div
                className="relative flex flex-1 flex-col items-center justify-start overflow-hidden p-4"
                onTouchStart={handleSwipeStart}
                onTouchEnd={handleSwipeEnd}
                onMouseDown={handleSwipeStart}
                onMouseUp={handleSwipeEnd}
            >
                <div className="relative w-full max-w-md flex-1">
                    <div className={`${cardBase} ${cardState(0)}`}>
                        <div className="flex min-h-0 flex-1 flex-col space-y-5">
                            <div className="text-center">
                                <p className="text-sm text-purple-200">AI 피드백</p>
                                <h2 className="mt-1 text-2xl font-bold text-white">{exerciseName}</h2>
                                <p className="text-xs text-gray-300">{feedback.performedDate}</p>
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col space-y-3">
                                <div className="flex justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                                    <span className="text-gray-300">정확도</span>
                                    <span className="text-lg font-semibold text-purple-200">{accuracyText}</span>
                                </div>
                                <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-gray-200" style={{ whiteSpace: "pre-line" }}>
                                    {feedback.feedbackText || "피드백이 준비 중입니다."}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-shrink-0 flex-col gap-2">
                            <button
                                onClick={() => setSlideIndex(1)}
                                className="rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                그래프 보기 ▸
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg"
                            >
                                목록으로
                            </button>
                        </div>
                    </div>

                    <div className={`${cardBase} ${cardState(1)}`}>
                        <h2 className="text-center text-xl font-semibold text-white">운동 분석 그래프</h2>
                        <div className="flex flex-1 flex-col items-center justify-center">
                            <FeedbackGraph feedback={feedback} />
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => setSlideIndex(0)}
                                className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                ◂ 정보
                            </button>
                            <button
                                onClick={() => setSlideIndex(2)}
                                className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                동영상 ▸
                            </button>
                        </div>
                    </div>

                    <div className={`${cardBase} ${cardState(2)}`}>
                        <h2 className="text-center text-xl font-semibold text-white">동영상</h2>
                        <div className="mt-4 flex flex-1 items-center justify-center overflow-hidden">
                            {videoUrl ? (
                                <video src={videoUrl} controls className="max-h-full w-full rounded-2xl border border-white/20 shadow-lg object-contain" />
                            ) : (
                                <div className="rounded-2xl border border-dashed border-white/20 px-6 py-10 text-center text-gray-300">
                                    동영상이 없습니다.
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSlideIndex(1)}
                            className="mt-6 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            ◂ 그래프
                        </button>
                    </div>
                </div>

                <CardIndicator />
            </div>
        </Layout>
    );
}