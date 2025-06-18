import { useRef, useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import UploadGuideModal from "../components/UploadGuideModal";
import squatGuideGif from "../assets/squat_guide.gif";
import lungeGuideGif from "../assets/lunge_guide.gif";
import { uploadExerciseVideo } from "../api/feedback";
import useUserStore from "../stores/userStore";
import CustomSelect from "../components/CustomSelect";
import FeedbackListCard from "../components/FeedbackListCard";
import OrientationConfirmModal from "../components/OrientationConfirmModal";
import { useWebSocketStore } from '../stores/websocketStore';

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
    const connect = useWebSocketStore((state) => state.connect);
    const socket = useWebSocketStore((state) => state.socket);
    const { getUserId } = useUserStore();

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

    // 분석 API 호출 및 WebSocket 연결
    const handleConfirmAnalyze = async (orientation) => {
        setVideoOrientation(orientation);
        setShowOrientationModal(false);

        // 업로드할 데이터 준비
        const userId = getUserId();
        const exerciseId = 19; // 임시 데이터
        const video = selectedVideo;
        const isPortrait = orientation === "세로";
        const performedDate = "2025-06-12"; // 샘플 날짜

        if (!video) {
            alert("동영상을 업로드해야 합니다.");
            return;
        }

        try {
            // 동영상 업로드 API 호출
            const res = await uploadExerciseVideo({
                userId,
                exerciseId,
                video,
                isPortrait,
                performedDate,
            });

            // 실제로는 res.data.feedbackId 등 서버 응답에서 받아야 함
            const newFeedbackId = res.data.data.feedbackId || "none";
            alert("분석 요청이 성공적으로 전송되었습니다!");

            // WebSocket 연결
            const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;
            connect(`${wsBaseUrl}/ws/feedback/${newFeedbackId}`);
        } catch (e) {
            alert("동영상 업로드 또는 분석 요청에 실패했습니다.");
        }
    };

    // blob URL을 부모에서 관리
    const videoUrl = useMemo(() => {
        if (!selectedVideo) return null;
        return URL.createObjectURL(selectedVideo);
    }, [selectedVideo]);

    // selectedVideo가 바뀔 때만 revoke
    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [selectedVideo]); // <-- videoUrl이 아니라 selectedVideo로 변경

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

            {/* 분석하기 버튼 */}
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

            {/* 영상 방향 확인 모달 */}
            {showOrientationModal && (
                <OrientationConfirmModal
                    video={selectedVideo}
                    videoUrl={videoUrl}
                    orientation={videoOrientation}
                    setOrientation={setVideoOrientation}
                    onConfirm={handleConfirmAnalyze}
                    onClose={() => setShowOrientationModal(false)}
                />
            )}
        </Layout>
    );
}
