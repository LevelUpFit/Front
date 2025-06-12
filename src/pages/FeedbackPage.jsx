import { useRef, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import UploadGuideModal from "../components/UploadGuideModal";

export default function FeedbackPage() {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState("초급");
    const [selectedExercise, setSelectedExercise] = useState("스쿼트");
    const [showGuide, setShowGuide] = useState(false);

    const fileInputRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert("⚠️ 50MB 이하의 영상만 업로드할 수 있습니다.");
            return;
        }

        setSelectedVideo(file);

        const formData = new FormData();
        formData.append("video", file);
        formData.append("level", selectedLevel);
        formData.append("exercise", selectedExercise);

        fetch("http://localhost:8080/api/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("업로드 완료:", data);
                // TODO: 서버 응답 데이터를 활용하여 분석 결과 표시 등 처리
            })
            .catch((err) => {
                console.error("업로드 실패:", err);
            });
    };

    return (
        <Layout>
            {/* 상단 드롭다운 */}
            <div className="bg-gray-200 px-4 py-4">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="text-2xl mr-4">
                        ◀
                    </button>
                    <div className="flex flex-1 justify-center gap-24">
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="bg-white border px-4 py-2 rounded-full text-base shadow font-semibold"
                        >
                            <option value="초급">초급</option>
                            <option value="중급">중급</option>
                            <option value="고급">고급</option>
                        </select>
                        <select
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="bg-white border px-4 py-2 rounded-full text-base shadow font-semibold"
                        >
                            <option value="스쿼트">스쿼트</option>
                            <option value="런지">런지</option>
                            <option value="푸쉬업">푸쉬업</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 본문 */}
            <div className="p-4 space-y-6">
                <div className="bg-white p-4 rounded shadow space-y-4">
                    <img
                        src="/src/assets/squat_guide.png"
                        alt="스쿼트 가이드"
                        className="w-full object-contain"
                    />

                    <div className="flex gap-4">
                        <button
                            className="flex-1 bg-gray-200 py-2 rounded"
                            onClick={() => fileInputRef.current.click()}
                        >
                            업로드하기
                        </button>
                        <button
                            onClick={() => setShowGuide(true)}
                            className="flex-1 bg-gray-200 py-2 rounded"
                        >
                            업로드 가이드
                        </button>

                        {/* 숨겨진 파일 input */}
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime"
                            ref={fileInputRef}
                            onChange={handleVideoUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* 피드백 영역 */}
                <div className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-lg font-bold">동영상 피드백</h2>
                    <div className="flex gap-2">
                        <img
                            src="/images/squat_video_left.png"
                            alt="분석 이미지 1"
                            className="w-1/2 rounded border"
                        />
                        <img
                            src="/images/squat_video_right.png"
                            alt="분석 이미지 2"
                            className="w-1/2 rounded border"
                        />
                    </div>
                    <div className="bg-gray-100 p-4 rounded text-sm">
                        <strong>헬린이123 {selectedExercise} 피드백</strong>
                        <ul className="list-disc list-inside mt-2 text-gray-700">
                            <li>고관절 각도를 조금 더 세우세요.</li>
                            <li>무릎이 앞으로 너무 많이 나오니 엉덩이를 뒤로 빼주세요.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 업로드 가이드 모달 */}
            {showGuide && <UploadGuideModal onClose={() => setShowGuide(false)} />}
        </Layout>
    );
}
