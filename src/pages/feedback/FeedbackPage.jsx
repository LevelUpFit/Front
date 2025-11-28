import { useRef, useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import UploadGuideModal from "../../components/UploadGuideModal";
import squatGuideGif from "../../assets/squat_guide.gif";
import lungeGuideGif from "../../assets/lunge_guide.gif";
import { uploadExerciseVideo, getFeedbackList } from "../../api/feedback";
import useUserStore from "../../stores/userStore";
import OrientationConfirmModal from "../../components/OrientationConfirmModal";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { getFeedbackAvailableExercises } from "../../api/exercise";
import FeedbackListCard from "../../components/FeedbackListCard";
import CustomSelect from "../../components/CustomSelect";


export default function FeedbackPage() {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState("초급");
    const [selectedExercise, setSelectedExercise] = useState("");
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [exerciseIdNameMap, setExerciseIdNameMap] = useState({});
    const [showGuide, setShowGuide] = useState(false);
    const [showOrientationModal, setShowOrientationModal] = useState(false);
    const [videoOrientation, setVideoOrientation] = useState("세로");
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);

    const levelOptions = [
        { value: "초급", label: "초급" },
        { value: "중급", label: "중급" },
        { value: "고급", label: "고급" },
    ];

    const exerciseSelectOptions = useMemo(() => {
        return exerciseOptions.map(opt => ({
            value: opt.name,
            label: opt.name,
        }));
    }, [exerciseOptions]);


    const fileInputRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { connect } = useWebSocket();
    const { getUserId } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 피드백 리스트 상태
    const [feedbackList, setFeedbackList] = useState([]);

    // 운동별 가이드 GIF 매핑
    const exerciseGuideMap = {
        "스쿼트": squatGuideGif,
        "런지": lungeGuideGif,
    };

    // 운동명 옵션 및 id-name 매핑 불러오기
    useEffect(() => {
        async function fetchExercises() {
            try {
                const res = await getFeedbackAvailableExercises();
                if (res.data && Array.isArray(res.data.data)) {
                    // [{ name, exercise_id }]
                    const options = res.data.data.map(item => ({
                        name: item.name,
                        exercise_id: item.exercise_id,
                    }));
                    setExerciseOptions(options);
                    if (options.length > 0 && !selectedExercise) {
                        setSelectedExercise(options[0].name);
                    }
                    // id-name 매핑
                    const idNameMap = {};
                    res.data.data.forEach(item => {
                        idNameMap[item.exercise_id] = item.name;
                    });
                    setExerciseIdNameMap(idNameMap);
                }
            } catch (e) {
                setExerciseOptions([]);
                setExerciseIdNameMap({});
            }
        }
        fetchExercises();
        // eslint-disable-next-line
    }, []);

    // 피드백 리스트 불러오기 함수 분리
    const fetchFeedbackList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userId = getUserId();
            const res = await getFeedbackList(userId);
            if (res.data && Array.isArray(res.data.data)) {
                // feedbackId 내림차순 정렬
                const sorted = [...res.data.data].sort((a, b) => b.feedbackId - a.feedbackId);
                setFeedbackList(sorted);
            } else {
                setFeedbackList([]);
            }
        } catch (e) {
            setFeedbackList([]);
            setError("피드백 내역을 불러오지 못했어요.");
        } finally {
            setIsLoading(false);
        }
    };

    // 피드백 리스트 최초 불러오기
    useEffect(() => {
        fetchFeedbackList();
        // eslint-disable-next-line
    }, [getUserId]);

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
        if (!selectedVideo) {
            alert("동영상을 먼저 업로드해주세요.");
            return;
        }
        setShowOrientationModal(true);
    };

    // 난이도 문자열을 숫자로 변환하는 함수
    const getLevelNumber = (level) => {
        if (level === "초급") return 1;
        if (level === "중급") return 2;
        if (level === "고급") return 3;
        return 1; // 기본값
    };

    // level 숫자를 한글로 변환하는 함수
    function getLevelLabel(level) {
        if (level === 1) return "초급";
        if (level === 2) return "중급";
        if (level === 3) return "고급";
        return "";
    }

    // 분석 API 호출 및 WebSocket 연결
    const handleConfirmAnalyze = async (orientation) => {
        setVideoOrientation(orientation);
        setShowOrientationModal(false);

        const userId = getUserId();
        const exerciseId = selectedExerciseId;
        const video = selectedVideo;
        const isPortrait = orientation === "세로";
        const performedDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)
        const level = getLevelNumber(selectedLevel); // 난이도 숫자 변환

        if (!video) {
            alert("동영상을 업로드해야 합니다.");
            return;
        }

        try {
            const res = await uploadExerciseVideo({
                userId,
                exerciseId,
                video,
                isPortrait,
                performedDate,
                level, // level 필드 추가!
            });

            const newFeedbackId = res.data.data.feedbackId || "none";

            // WebSocket 연결 (전역 모달로 알림)
            connect(newFeedbackId);

            // 업로드 후 피드백 리스트 갱신
            await fetchFeedbackList();
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
    }, [videoUrl]);

    // 운동이 선택될 때마다 id도 자동 저장
    useEffect(() => {
        if (!selectedExercise || !exerciseOptions.length) {
            setSelectedExerciseId(null);
            return;
        }
        // exerciseOptions가 ["스쿼트", "런지"]가 아니라 [{name, exercise_id}, ...] 형태여야 함!
        // 만약 options가 이름 배열이면 아래처럼 매핑해서 객체 배열로 바꿔주세요.
        const selected = exerciseOptions.find((opt) => opt.name === selectedExercise);
        setSelectedExerciseId(selected ? selected.exercise_id : null);
    }, [selectedExercise, exerciseOptions]);

    const selectClassName = "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-lg transition focus:border-purple-400 focus:outline-none";

    return (
        <Layout>
            <div className="flex flex-col gap-4 p-0">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
                        aria-label="이전 화면으로"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-white">AI 자세 분석</h1>
                    <div className="h-10 w-10" aria-hidden="true" />
                </div>

                <div className="flex gap-3">
                    <CustomSelect
                        options={levelOptions}
                        value={selectedLevel}
                        onChange={setSelectedLevel}
                    />
                    <CustomSelect
                        options={exerciseSelectOptions}
                        value={selectedExercise}
                        onChange={setSelectedExercise}
                        placeholder="운동 선택"
                    />
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-lg sm:p-6">
                    <div className="mb-4 flex justify-center">
                        <img
                            src={exerciseGuideMap[selectedExercise] || squatGuideGif}
                            alt={`${selectedExercise || "운동"} 동작 예시`}
                            className="h-auto w-full max-w-xs rounded-lg bg-black/20 object-contain"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="flex-1 rounded-lg bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            업로드
                        </button>
                        <button
                            className="flex-1 rounded-lg bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            onClick={() => setShowGuide(true)}
                        >
                            가이드
                        </button>
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime"
                            ref={fileInputRef}
                            onChange={handleVideoUpload}
                            className="hidden"
                        />
                    </div>
                    {selectedVideo && (
                        <p className="mt-3 truncate text-center text-xs text-purple-200">
                            {selectedVideo.name}
                        </p>
                    )}
                </div>

                <button
                    className={`w-full rounded-lg py-3 text-lg font-bold transition duration-300 ${
                        selectedVideo
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:scale-105"
                            : "cursor-not-allowed bg-gray-700/50 text-gray-400"
                    }`}
                    onClick={handleAnalyze}
                    disabled={!selectedVideo}
                >
                    분석하기
                </button>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-lg">
                    <div className="mb-3 flex items-center justify-between text-white">
                        <h2 className="text-lg font-semibold">피드백 내역</h2>
                        <span className="text-xs text-purple-200">총 {feedbackList.length}건</span>
                    </div>
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <svg className="h-8 w-8 animate-spin text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : error ? (
                        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-center text-rose-200">
                            <p className="font-semibold">오류 발생</p>
                            <p className="mt-1 text-sm">{error}</p>
                        </div>
                    ) : feedbackList.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.5 4.5 0 0012 15a4.5 4.5 0 00-3.182 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            </svg>
                            <p className="mt-3 font-semibold text-gray-300">아직 AI 피드백이 없어요</p>
                            <p className="mt-1 text-xs text-gray-400">운동 영상을 업로드하고 첫 피드백을 받아보세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {feedbackList.map((feedback) => (
                                <button
                                    key={feedback.feedbackId}
                                    onClick={() => navigate(`/feedback/${feedback.feedbackId}`, { state: { feedback } })}
                                    className="block w-full text-left"
                                >
                                    <FeedbackListCard
                                        feedback={{
                                            exercise: `${exerciseIdNameMap[feedback.exerciseId] || "알 수 없는 운동"} (${getLevelLabel(feedback.level)})`,
                                            date: feedback.performedDate,
                                            status: feedback.videoUrl === null ? "pending" : "done",
                                            accuracy: feedback.accuracy,
                                            movementRange: feedback.movementRange,
                                            movementSpeed: feedback.movementSpeed,
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showGuide && <UploadGuideModal onClose={() => setShowGuide(false)} />}
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
