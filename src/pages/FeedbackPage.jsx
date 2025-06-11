import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function FeedbackPage() {
    const navigate = useNavigate();

    // ✅ 선택 상태 추가
    const [selectedLevel, setSelectedLevel] = useState("초급");
    const [selectedExercise, setSelectedExercise] = useState("스쿼트");

    return (
        <Layout>
            <div className="bg-gray-200 px-4 py-4">
                <div className="flex items-center">
                    {/* ◀ 버튼 */}
                    <button onClick={() => navigate(-1)} className="text-2xl mr-4">
                        ◀
                    </button>

                    {/* 드롭다운 */}
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

            {/* ✅ 본문 */}
            <div className="p-4 space-y-6">
                {/* 운동 이미지 + 업로드 버튼 */}
                <div className="bg-white p-4 rounded shadow space-y-4">
                    <img
                        src="/src/assets/squat_guide.png"
                        alt="스쿼트 가이드"
                        className="w-full object-contain"
                    />

                    <div className="flex gap-4">
                        <button className="flex-1 bg-gray-200 py-2 rounded">업로드하기</button>
                        <button className="flex-1 bg-gray-200 py-2 rounded">업로드 가이드</button>
                    </div>
                </div>

                {/* 분석 피드백 */}
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
        </Layout>
    );
}
