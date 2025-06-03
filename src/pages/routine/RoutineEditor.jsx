// src/pages/routine/RoutineEditor.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../../components/BackButton";
import Layout from "../../components/Layout";

export default function RoutineEditor() {
    const navigate = useNavigate();
    const [routineName, setRoutineName] = useState("나만의 루틴1");
    const [selectedPart, setSelectedPart] = useState("등");

    const muscleOptions = ["등", "가슴", "어깨", "복부", "하체"];

    return (
        <Layout>
            <div className="relative px-4">
                <BackButton />
                <div className="text-blue-600 text-lg font-bold mb-2 mt-4">편집 모드</div>

                {/* 루틴명 입력 */}
                <input
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    maxLength={30}
                    className="border w-full px-3 py-2 rounded-lg mb-4 text-lg"
                />

                {/* 부위 선택 */}
                <div className="flex gap-4 justify-center mb-4">
                    {muscleOptions.map((muscle) => (
                        <button
                            key={muscle}
                            onClick={() => setSelectedPart(muscle)}
                            className={`p-2 border rounded-full ${
                                selectedPart === muscle ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-between mt-10">
                    <button
                        onClick={() => navigate("/routine")}
                        className="px-4 py-2 text-gray-600"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => {
                            // 저장 API 연결 예정
                            alert("루틴이 저장되었습니다.");
                            navigate("/routine");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        저장
                    </button>
                </div>
            </div>
        </Layout>
    );
}
