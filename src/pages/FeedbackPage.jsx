import { useRef, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import UploadGuideModal from "../components/UploadGuideModal";
import squatGuideGif from "../assets/squat_guide.gif";
import lungeGuideGif from "../assets/lunge_guide.gif";

// 커스텀 드롭다운 컴포넌트
function CustomSelect({ options, value, onChange, borderColor = "#3b82f6", open, setOpen, name }) {
    const isActive = open === name;
    const selectRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;
        const handleClick = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isActive, setOpen]);

    return (
        <div className="relative w-36 select-none" ref={selectRef}>
            <button
                type="button"
                className="w-full bg-white rounded-xl border-2 py-1.5 px-3 text-base font-semibold flex items-center justify-between"
                style={{
                    borderColor: isActive ? borderColor : "#e5e7eb",
                    boxShadow: isActive ? `0 0 0 2px #3b82f655` : "0 2px 8px 0 #3b82f622",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    minHeight: 38,
                }}
                onClick={() => setOpen(isActive ? null : name)}
                tabIndex={0}
            >
                <span className="truncate">{value}</span>
                <span className="ml-2 text-base text-gray-500">▴</span>
            </button>
            {isActive && (
                <div
                    className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-lg z-20 border"
                    style={{ boxShadow: "0 4px 16px 0 #3b82f633" }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-4 py-2 cursor-pointer text-base ${
                                value === opt
                                    ? "bg-blue-100 text-blue-700 font-bold"
                                    : "hover:bg-blue-50"
                            }`}
                            onClick={() => {
                                onChange(opt);
                                setOpen(null);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 피드백 카드 컴포넌트
function FeedbackListCard({ feedback }) {
    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-2 shadow-sm">
            <div>
                <div className="font-semibold">{feedback.exercise} ({feedback.level})</div>
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

// 분석 모달 컴포넌트 (영상 방향 선택 포함)
function OrientationConfirmModal({ video, orientation, setOrientation, onConfirm, onClose }) {
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!video) return;
        const url = URL.createObjectURL(video);
        const tempVideo = document.createElement("video");
        tempVideo.src = url;
        tempVideo.onloadedmetadata = () => {
            setVideoSize({
                width: tempVideo.videoWidth,
                height: tempVideo.videoHeight,
            });
            URL.revokeObjectURL(url);
        };
    }, [video]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs mx-auto text-center">
                <h2 className="text-lg font-bold mb-4">영상 방향을 확인해주세요</h2>
                {/* 업로드한 영상 미리보기 */}
                {video ? (
                    <div
                        className="mx-auto mb-4 bg-black rounded flex items-center justify-center"
                        style={{
                            width: videoSize.width ? `${Math.min(videoSize.width, 320)}px` : "auto",
                            height: videoSize.height
                                ? `${Math.min(videoSize.height, 320)}px`
                                : "auto",
                            maxWidth: "100%",
                            maxHeight: "320px",
                        }}
                    >
                        <video
                            src={URL.createObjectURL(video)}
                            controls
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "block",
                                background: "#000",
                                borderRadius: "0.5rem",
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded mb-4 text-gray-400">
                        동영상을 업로드 해야합니다
                    </div>
                )}
                {/* 세로/가로 토글 버튼 */}
                <div className="flex justify-center my-0 mb-4">
                    <div className="relative flex w-[190px] h-10 bg-gray-100 rounded-full shadow-sm mx-auto">
                        <span
                            className="absolute top-0 left-0 h-full w-1/2 transition-all duration-300 rounded-full bg-blue-500 z-0"
                            style={{
                                transform: orientation === "가로"
                                    ? "translateX(100%)"
                                    : "translateX(0%)",
                            }}
                        />
                        <button
                            className={`relative flex-1 z-10 text-base font-semibold transition-colors duration-300
                                ${orientation === "세로" ? "text-white" : "text-gray-700"}
                            `}
                            style={{ borderRadius: "9999px" }}
                            onClick={() => setOrientation("세로")}
                            type="button"
                        >
                            세로영상
                        </button>
                        <button
                            className={`relative flex-1 z-10 text-base font-semibold transition-colors duration-300
                                ${orientation === "가로" ? "text-white" : "text-gray-700"}
                            `}
                            style={{ borderRadius: "9999px" }}
                            onClick={() => setOrientation("가로")}
                            type="button"
                        >
                            가로영상
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex-1 bg-blue-500 text-white py-2 rounded font-bold"
                        onClick={() => video && onConfirm(orientation)}
                        disabled={!video}
                    >
                        확인
                    </button>
                    <button
                        className="flex-1 bg-gray-300 py-2 rounded font-bold"
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FeedbackPage() {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState("초급");
    const [selectedExercise, setSelectedExercise] = useState("스쿼트");
    const [showGuide, setShowGuide] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showOrientationModal, setShowOrientationModal] = useState(false);
    const [videoOrientation, setVideoOrientation] = useState("세로");

    const fileInputRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // 예시 피드백 리스트
    const [feedbackList] = useState([
        {
            id: 1,
            exercise: "스쿼트",
            level: "초급",
            status: "pending",
            date: "2025-06-17 13:12",
        },
        {
            id: 2,
            exercise: "런지",
            level: "중급",
            status: "done",
            date: "2025-06-15 09:30",
        },
        {
            id: 3,
            exercise: "푸쉬업",
            level: "고급",
            status: "fail",
            date: "2025-06-10 17:44",
        },
    ]);

    // 운동별 가이드 GIF 매핑
    const exerciseGuideMap = {
        "스쿼트": squatGuideGif,
        "런지": lungeGuideGif,
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert("⚠️ 50MB 이하의 영상만 업로드할 수 있습니다.");
            return;
        }

        setSelectedVideo(file);
    };

    // 분석하기 버튼 클릭 핸들러
    const handleAnalyze = () => {
        setShowOrientationModal(true);
    };

    // 실제 분석 API 호출 핸들러
    const handleConfirmAnalyze = (orientation) => {
        setVideoOrientation(orientation);
        setShowOrientationModal(false);
        // TODO: 분석 API 호출 로직 작성
        // analyzeVideo({ orientation, video: selectedVideo })
    };

    return (
        <Layout>
            {/* 상단 드롭다운 */}
            <div className="bg-gray-200 px-4 py-4">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="text-2xl mr-4">
                        ◀
                    </button>
                    <div className="flex flex-1 justify-center gap-8">
                        <CustomSelect
                            options={["초급", "중급", "고급"]}
                            value={selectedLevel}
                            onChange={setSelectedLevel}
                            open={openDropdown}
                            setOpen={setOpenDropdown}
                            name="level"
                        />
                        <CustomSelect
                            options={["스쿼트", "런지"]}
                            value={selectedExercise}
                            onChange={setSelectedExercise}
                            open={openDropdown}
                            setOpen={setOpenDropdown}
                            name="exercise"
                        />
                    </div>
                </div>
            </div>

            {/* 업로드/가이드 카드 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow mb-4 flex flex-col items-center max-w-md mx-auto mt-6">
                <div className="flex justify-center gap-4 mb-6">
                    <img
                        src={exerciseGuideMap[selectedExercise]}
                        alt={`${selectedExercise} 동작 예시`}
                        className="w-64 h-40 object-contain"
                    />
                </div>
                <div className="flex gap-4 w-full">
                    <button
                        className="flex-1 bg-gray-200 py-2 rounded text-lg font-semibold"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        업로드하기
                    </button>
                    <button
                        className="flex-1 bg-gray-200 py-2 rounded text-lg font-semibold"
                        onClick={() => setShowGuide(true)}
                    >
                        업로드 가이드
                    </button>
                    <input
                        type="file"
                        accept="video/mp4,video/quicktime"
                        ref={fileInputRef}
                        onChange={handleVideoUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* 분석하기 버튼 (길게, 카드와 피드백 내역 사이) */}
            <div className="max-w-md mx-auto w-full mb-4">
                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-3 rounded-xl shadow transition"
                    onClick={handleAnalyze}
                >
                    분석하기
                </button>
            </div>

            {/* 피드백 리스트 영역 */}
            <div className="bg-white p-4 rounded shadow space-y-2 mt-4 max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-2">피드백 내역</h2>
                {feedbackList.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">피드백 내역이 없습니다.</div>
                ) : (
                    feedbackList.map((feedback) => (
                        <FeedbackListCard
                            key={feedback.id}
                            feedback={feedback}
                        />
                    ))
                )}
            </div>

            {/* 업로드 가이드 모달 */}
            {showGuide && <UploadGuideModal onClose={() => setShowGuide(false)} />}

            {/* 영상 방향 확인 모달 (세로/가로 토글 포함, 페이지 내 토글 제거됨) */}
            {showOrientationModal && (
                <OrientationConfirmModal
                    video={selectedVideo}
                    orientation={videoOrientation}
                    setOrientation={setVideoOrientation}
                    onConfirm={handleConfirmAnalyze}
                    onClose={() => setShowOrientationModal(false)}
                />
            )}
        </Layout>
    );
}
