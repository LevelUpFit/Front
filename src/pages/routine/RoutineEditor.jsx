import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { createRoutine, patchRoutine, getRoutineById } from "../../api/routine";
import useUserStore from "../../stores/userStore";
import Layout from "../../components/Layout";

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
        <Layout>
            <div className="space-y-6">
                {/* 헤더 */}
                <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-5 shadow-2xl backdrop-blur-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-white">{isEdit ? "루틴 수정" : "새 루틴 만들기"}</h1>
                                <p className="text-sm text-purple-200">나만의 운동 루틴을 설정하세요</p>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition cursor-pointer">
                            <Camera className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {routineExercises.length > 0 && (
                    <div className="space-y-3">
                        {routineExercises.map((ex) => (
                            <div
                                key={ex.id}
                                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur-lg"
                            >
                                <img src={ex.thumbnailUrl} alt={ex.name} className="h-16 w-16 object-contain" />
                                <div className="min-w-0">
                                    <div className="truncate text-lg font-semibold">{ex.name}</div>
                                    <div className="text-sm text-purple-200">{ex.targetMuscle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 루틴 이름 입력 */}
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-lg">
                    <label className="block text-sm font-semibold text-white mb-3">
                        <span className="flex items-center gap-2">
                            <span className="text-purple-400">📝</span>
                            루틴 이름
                        </span>
                    </label>
                    <div className="relative">
                        <input
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            maxLength={30}
                            placeholder="루틴 이름을 입력하세요"
                            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {routineName.length}/30
                        </span>
                    </div>
                </div>

                {/* 타겟 부위 선택 */}
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-lg">
                    <label className="block text-sm font-semibold text-white mb-4">
                        <span className="flex items-center gap-2">
                            <span className="text-purple-400">💪</span>
                            타겟 부위 선택
                        </span>
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        {muscleOptions.map((item) => {
                            const isSelected = selectedPart === item.label;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setSelectedPart(item.label)}
                                    className={`relative flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 ${
                                        isSelected
                                            ? "bg-gradient-to-b from-purple-500/40 to-indigo-600/40 border-2 border-purple-400 shadow-lg shadow-purple-500/30 scale-105"
                                            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30"
                                    }`}
                                >
                                    {/* 선택 표시 체크 아이콘 */}
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center ${
                                        isSelected ? "bg-white/20 ring-2 ring-purple-400" : "bg-white/10"
                                    }`}>
                                        <img 
                                            src={item.img} 
                                            alt={item.label} 
                                            className={`w-full h-full object-contain transition-all ${
                                                isSelected ? "scale-110" : "opacity-70"
                                            }`} 
                                        />
                                    </div>
                                    <span className={`text-xs font-medium transition-colors ${
                                        isSelected ? "text-purple-300" : "text-gray-400"
                                    }`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* 선택된 부위 표시 */}
                    <div className="mt-4 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                            <span className="text-sm text-gray-300">선택된 부위:</span>
                            <span className="text-sm font-bold text-purple-300">{selectedPart}</span>
                        </span>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/routine")}
                        className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3.5 text-base font-semibold text-gray-300 transition hover:bg-white/10"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleGoToSetEditor}
                        className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/50"
                    >
                        다음 단계
                    </button>
                </div>
            </div>
        </Layout>
    );
}
