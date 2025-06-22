import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout";
import { getExerciseById } from "../../api/exercise";

// 예시 그래프 컴포넌트 (실제 데이터에 맞게 교체하세요)
function FeedbackGraph({ feedback }) {
    const accuracy = feedback.accuracy || 0;
    const movementRange = feedback.movementRange || 0;
    // movementSpeed가 객체일 수 있으니 안전하게 처리
    const contractionPercent = feedback.movementSpeed?.contractionPercent;
    const relaxationPercent = feedback.movementSpeed?.relaxationPercent;
    // 수축/이완 평균값 (둘 다 undefined/null이면 undefined)
    const hasSpeed = typeof contractionPercent === "number" && typeof relaxationPercent === "number";
    const avgSpeedPercent = hasSpeed ? (contractionPercent + relaxationPercent) / 2 : undefined;

    // 속도 값이 있을 때만 그래프에 포함
    const graphData = [
        { label: "정확도", value: accuracy },
        { label: "가동범위", value: movementRange },
        ...(hasSpeed ? [{ label: "속도", value: avgSpeedPercent }] : []),
    ];

    // w-1/4 → w-1/3 등으로 자동 너비 조정
    const widthClass = `w-1/${graphData.length}`;

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-full justify-around items-end h-40 mb-4">
                {graphData.map((d, i) => (
                    <div key={i} className={`flex flex-col items-center ${widthClass}`}>
                        <div
                            className="bg-blue-400 rounded-t"
                            style={{
                                height: `${d.value * 1.2}px`,
                                minHeight: "10px",
                                width: "32px",
                                transition: "height 0.5s"
                            }}
                        />
                        <span className="mt-2 text-sm font-semibold">{d.label}</span>
                        <span className="text-xs text-gray-600">{d.value.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FeedbackDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const feedback = location.state?.feedback;
    const [exerciseName, setExerciseName] = useState("");
    const [slideIndex, setSlideIndex] = useState(0);
    const containerRef = useRef(null);
    const startX = useRef(null);

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

    // 슬라이드 터치/드래그 이벤트 핸들러
    const handleTouchStart = (e) => {
        startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const handleTouchEnd = (e) => {
        if (startX.current === null) return;
        const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const diff = endX - startX.current;
        if (diff < -50 && slideIndex < 2) setSlideIndex(slideIndex + 1); // 왼쪽으로 슬라이드
        if (diff > 50 && slideIndex > 0) setSlideIndex(slideIndex - 1);  // 오른쪽으로 슬라이드
        startX.current = null;
    };

    const videoUrls = feedback.videoUrl ? [feedback.videoUrl] : [];

    // 카드 스타일
    const cardBase =
        "absolute left-1/2 top-1/3 w-[90vw] max-w-md h-[100%] -translate-x-1/2 -translate-y-1/3 bg-white rounded-2xl shadow-2xl p-6 transition-all duration-500 flex flex-col";

    const cardStates = [
        // 0: 정보, 1: 그래프, 2: 동영상
        (idx) =>
            slideIndex === idx
                ? "z-20 opacity-100 scale-100"
                : slideIndex < idx
                ? "z-10 opacity-0 scale-90 translate-x-[60vw] pointer-events-none"
                : "z-10 opacity-0 scale-90 -translate-x-[60vw] pointer-events-none",
        (idx) =>
            slideIndex === idx
                ? "z-20 opacity-100 scale-100"
                : slideIndex < idx
                ? "z-10 opacity-0 scale-90 translate-x-[60vw] pointer-events-none"
                : "z-10 opacity-0 scale-90 -translate-x-[60vw] pointer-events-none",
        (idx) =>
            slideIndex === idx
                ? "z-20 opacity-100 scale-100"
                : slideIndex < idx
                ? "z-10 opacity-0 scale-90 translate-x-[60vw] pointer-events-none"
                : "z-10 opacity-0 scale-90 -translate-x-[60vw] pointer-events-none",
    ];

    // 카드 인디케이터 컴포넌트
    const CardIndicator = () => (
        <div className="w-full flex justify-center items-center gap-2 py-4">
            {[0, 1, 2].map(idx => (
                <div
                    key={idx}
                    className="h-2 rounded-full transition-all duration-200 cursor-pointer"
                    style={{
                        width: 40,
                        height: 8,
                        border: slideIndex === idx ? "2px solid #3b82f6" : "1px solid #a5b4fc",
                        background: slideIndex === idx
                            ? "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #6366f1 100%)"
                            : "linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%)",
                        opacity: slideIndex === idx ? 1 : 0.7,
                        boxShadow: slideIndex === idx ? "0 0 10px #60a5fa66" : "none"
                    }}
                    onClick={() => setSlideIndex(idx)}
                />
            ))}
        </div>
    );

    return (
        <Layout>
            <div className="w-full h-[calc(90vh-55px)] flex flex-col items-center justify-center bg-gradient-to-b from-[#f5f7fa] to-[#e8eaf6] relative overflow-hidden">
                {/* 카드 컨테이너 */}
                <div className="relative w-[90vw] max-w-md h-[80%]">
                    {/* 카드 1: 정보 */}
                    <div
                        className={`${cardBase} ${cardStates[0](0)}`}
                        style={{ minHeight: "420px" }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                    >
                        {/* 카드 상단 제목 고정 */}
                        <div className="w-full flex flex-col items-center">
                            <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center mt-2">피드백 상세</h1>
                        </div>
                        {/* 카드 내용 */}
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            <div className="flex items-center w-full max-w-xs mx-auto">
                                <span className="font-semibold w-24 text-gray-700">운동명</span>
                                <span className="ml-2 text-gray-900">{exerciseName}</span>
                            </div>
                            <div className="flex items-center w-full max-w-xs mx-auto">
                                <span className="font-semibold w-24 text-gray-700">수행일자</span>
                                <span className="ml-2 text-gray-900">{feedback.performedDate}</span>
                            </div>
                            <div className="flex items-center w-full max-w-xs mx-auto">
                                <span className="font-semibold w-24 text-gray-700">정확도</span>
                                <span className="ml-2 text-gray-900">
                                    {feedback.accuracy ? `${feedback.accuracy.toFixed(2)}%` : "-"}
                                </span>
                            </div>
                            <div className="w-full max-w-xs mx-auto">
                                <span className="font-semibold text-gray-700">피드백</span>
                                <div className="mt-1 p-3 bg-gray-50 rounded text-gray-800 min-h-[48px]" style={{ whiteSpace: "pre-line" }}>
                                    {feedback.feedbackText || "없음"}
                                </div>
                            </div>
                        </div>
                        {/* 카드 하단 버튼 영역 */}
                        <div className="w-full flex flex-col gap-4 mt-6">
                            <button
                                className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold shadow"
                                onClick={() => setSlideIndex(1)}
                            >
                                그래프 보기 ▸
                            </button>
                            <button
                                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold shadow transition"
                                onClick={() => navigate(-1)}
                            >
                                목록으로
                            </button>
                        </div>
                    </div>
                    {/* 카드 2: 그래프 */}
                    <div
                        className={`${cardBase} ${cardStates[1](1)}`}
                        style={{ minHeight: "420px" }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                    >
                        {/* 카드 상단 제목 고정 */}
                        <div className="w-full flex flex-col items-center">
                            <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center mt-2">운동 분석 그래프</h1>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            <FeedbackGraph feedback={feedback} />
                        </div>
                        <div className="w-full flex flex-col gap-4 mt-6">
                            <button
                                className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold shadow"
                                onClick={() => setSlideIndex(2)}
                            >
                                동영상 보기 ▸
                            </button>
                            <button
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold shadow"
                                onClick={() => setSlideIndex(0)}
                            >
                                ◂ 정보로 돌아가기
                            </button>
                        </div>
                    </div>
                    {/* 카드 3: 동영상 */}
                    <div
                        className={`${cardBase} ${cardStates[2](2)}`}
                        style={{ minHeight: "420px" }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                    >
                        {/* 카드 상단 제목 고정 */}
                        <div className="w-full flex flex-col items-center">
                            <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center mt-2">동영상</h1>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            {videoUrls.length > 0 ? (
                                <video
                                    src={videoUrls[0]}
                                    controls
                                    className="w-[70%] rounded-lg border border-gray-200 shadow"
                                />
                            ) : (
                                <div className="text-gray-400">동영상이 없습니다.</div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-4 mt-6">
                            <button
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold shadow"
                                onClick={() => setSlideIndex(1)}
                            >
                                ◂ 그래프로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
                {/* 카드 외부 하단에 인디케이터 */}
                <CardIndicator />
            </div>
        </Layout>
    );
}