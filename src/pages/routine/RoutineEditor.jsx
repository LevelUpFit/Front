import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { createRoutine } from "../../api/routine";
import useUserStore from "../../stores/userStore"; // 추가

import backImg from "../../assets/back.png";
import chestImg from "../../assets/chest.png";
import shoulderImg from "../../assets/shoulder.png";
import legImg from "../../assets/leg.png";

export default function RoutineEditor() {
    const navigate = useNavigate();
    const { getUserId } = useUserStore(); // 추가
    const [routineName, setRoutineName] = useState("나만의 루틴1");
    const [selectedPart, setSelectedPart] = useState("등");
    const [routineExercises, setRoutineExercises] = useState([]);
    // 예시 운동 데이터
    const allExercises = [
        { id: 1, name: "케이블 로우", targetMuscle: "등", thumbnailUrl: "/img1.png" },
        { id: 2, name: "어시스트 풀업", targetMuscle: "등", thumbnailUrl: "/img2.png" },
        { id: 3, name: "랫 풀다운", targetMuscle: "등", thumbnailUrl: "/img3.png" },
        { id: 4, name: "V 업", targetMuscle: "복근", thumbnailUrl: "/img4.png" },
    ];

    // 운동 추가
    const handleAddExercises = (ids) => {
        const selected = allExercises.filter((ex) => ids.includes(ex.id));
        setRoutineExercises((prev) => [...prev, ...selected]);
        setShowAddModal(false);
    };

    // 저장 버튼 클릭 시 루틴 생성 후 routineId와 함께 다음 페이지로 이동
    const handleGoToSetEditor = async () => {
        try {
            const userId = getUserId();
            const res = await createRoutine({
                userId,
                name: routineName,
                targetMuscle: selectedPart,
                description: "기능 구현중",
                difficulty: 1,
            });
            if (res.data.success) {
                const routineId = res.data.data.routineId;
                navigate("/routine/set-editor", {
                    state: {
                        routineId,
                        name: routineName,
                        targetMuscle: selectedPart,
                        thumbnailUrl: muscleOptions.find(m => m.label === selectedPart)?.img || "",
                        exercises: [], // 최초엔 빈 배열
                    },
                });
            } else {
                alert("루틴 생성에 실패했습니다.");
            }
        } catch (e) {
            alert("저장 실패");
        }
    };

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

            {/* 운동 카드 리스트 */}
            <div className="px-4 py-4 space-y-4">
                {routineExercises.map((ex) => (
                    <div key={ex.id} className="bg-gray-50 rounded-xl p-4 flex gap-4 items-center">
                        <img src={ex.thumbnailUrl} alt={ex.name} className="w-16 h-16 object-contain" />
                        <div>
                            <div className="font-bold">{ex.name}</div>
                            <div className="text-gray-500">{ex.targetMuscle}</div>
                        </div>
                    </div>
                ))}
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
                    onClick={handleGoToSetEditor}
                    className="text-lg text-blue-600 font-bold"
                >
                    저장
                </button>
            </div>
        </div>
    );
}
