import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

import backImg from "../../assets/back.png";
import chestImg from "../../assets/chest.png";
import shoulderImg from "../../assets/shoulder.png";
import legImg from "../../assets/leg.png";

export default function RoutineEditor() {
    const navigate = useNavigate();
    const [routineName, setRoutineName] = useState("나만의 루틴1");
    const [selectedPart, setSelectedPart] = useState("등");

    const muscleOptions = [
        { label: "등", img: backImg },
        { label: "가슴", img: chestImg },
        { label: "어깨", img: shoulderImg },
        { label: "하체", img: legImg },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 상단 파란 헤더 */}
            <div className="bg-blue-600 px-4 py-4 rounded-b-2xl relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="text-white text-2xl">◀</button>
                        <span className="text-white text-lg font-bold">{routineName}</span>
                        <span>✏️</span>
                    </div>
                    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <Camera className="text-white w-6 h-6" />
                    </div>
                </div>
                <div className="text-white text-sm mt-1">편집 모드</div>
            </div>

            {/* 운동 추가 버튼 */}
            <div className="py-4 px-4 text-center border-b font-bold text-lg">
                + 운동 추가
            </div>

            {/* 이름 입력 필드 */}
            <div className="flex justify-center items-center gap-2 px-4 py-4">
                <input
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    maxLength={30}
                    className="flex-1 border px-4 py-2 rounded-full text-lg bg-gray-100"
                />
                <span className="text-gray-500">{routineName.length}/30</span>
            </div>

            <div className="flex justify-center gap-4 py-4">
                {muscleOptions.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setSelectedPart(item.label)}
                        className={`w-20 h-20 flex items-center justify-center rounded-full overflow-hidden
                ${selectedPart === item.label ? "ring-4 ring-black" : ""}`}
                    >
                        <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-contain"
                        />
                    </button>
                ))}
            </div>


            {/* 저장/취소 버튼 */}
            <div className="flex justify-between px-8 mt-6">
                <button onClick={() => navigate("/routine")} className="text-lg text-gray-600">
                    취소
                </button>
                <button
                    onClick={() => {
                        alert("루틴이 저장되었습니다.");
                        navigate("/routine");
                    }}
                    className="text-lg text-blue-600 font-bold"
                >
                    저장
                </button>
            </div>
        </div>
    );
}
