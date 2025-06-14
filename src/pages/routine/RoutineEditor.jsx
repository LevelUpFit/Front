import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Camera } from "lucide-react";
import { createRoutine, patchRoutine, getRoutineById } from "../../api/routine";
import useUserStore from "../../stores/userStore";

import backImg from "../../assets/back.png";
import chestImg from "../../assets/chest.png";
import shoulderImg from "../../assets/shoulder.png";
import legImg from "../../assets/leg.png";

export default function RoutineEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id && id !== "new";
    const { getUserId } = useUserStore();

    const [routineName, setRoutineName] = useState("나만의 루틴1");
    const [selectedPart, setSelectedPart] = useState("등");
    const [routineExercises, setRoutineExercises] = useState([]);

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        if (isEdit) {
            const fetch = async () => {
                try {
                    const userId = getUserId();
                    const res = await getRoutineById(userId);
                    // 실제 API에 맞게 아래 부분 수정 필요
                    const found = res.data.data.find(r => String(r.routineId) === String(id));
                    if (found) {
                        setRoutineName(found.name);
                        setSelectedPart(found.targetMuscle);
                        // setRoutineExercises(found.exercises || []); // exercises 필드가 있다면
                    }
                } catch (e) {
                    alert("루틴 정보를 불러오지 못했습니다.");
                }
            };
            fetch();
        }
    }, [id, isEdit, getUserId]);

    // 운동 추가
    const handleAddExercises = (ids) => {
        const selected = allExercises.filter((ex) => ids.includes(ex.id));
        setRoutineExercises((prev) => [...prev, ...selected]);
        setShowAddModal(false);
    };

    // 저장 버튼 클릭 시
    const handleGoToSetEditor = async () => {
        try {
            const userId = getUserId();
            let routineId;
            if (isEdit && id) {
                // PATCH (수정)
                const res = await patchRoutine({
                    routineId: Number(id),
                    name: routineName,
                    description: "기능 구현중",
                    difficulty: 1,
                });
                if (!res.data.success) throw new Error();
                routineId = Number(id);
            } else {
                // POST (생성)
                const res = await createRoutine({
                    userId,
                    name: routineName,
                    targetMuscle: selectedPart,
                    description: "기능 구현중",
                    difficulty: 1,
                });
                if (res.data.success) {
                    routineId = res.data.data.routineId;
                } else {
                    throw new Error();
                }
            }
            navigate("/routine/set-editor", {
                state: {
                    routineId,
                    name: routineName,
                    targetMuscle: selectedPart,
                    thumbnailUrl: muscleOptions.find(m => m.label === selectedPart)?.img || "",
                },
            });
        } catch (e) {
            alert(isEdit ? "수정 실패" : "저장 실패");
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
                <div className="text-white text-sm mt-1">{isEdit ? "수정 모드" : "편집 모드"}</div>
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
