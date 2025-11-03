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
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold hover:bg-white/20"
                            >
                                ◀
                            </button>
                            <div>
                                <div className="text-xl font-bold">{routineName}</div>
                                <div className="text-sm text-purple-200">{isEdit ? "루틴 수정" : "새 루틴 만들기"}</div>
                            </div>
                            <span className="text-xl">✏️</span>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
                            <Camera className="h-6 w-6" />
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

                <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-lg">
                    <label className="block text-sm font-semibold text-purple-200">루틴 이름</label>
                    <div className="mt-3 flex items-center gap-3">
                        <input
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            maxLength={30}
                            className="flex-1 rounded-full border border-white/20 bg-black/20 px-5 py-3 text-base text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none"
                        />
                        <span className="text-sm text-gray-300">{routineName.length}/30</span>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-lg">
                    <p className="text-sm font-semibold text-purple-200">타겟 부위 선택</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                        {muscleOptions.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => setSelectedPart(item.label)}
                                className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border transition ${
                                    selectedPart === item.label
                                        ? "border-purple-400 bg-purple-500/30"
                                        : "border-white/20 bg-white/10 hover:border-purple-300"
                                }`}
                            >
                                <img src={item.img} alt={item.label} className="h-full w-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/routine")}
                        className="flex-1 rounded-full border border-white/20 bg-white/5 py-3 text-base font-semibold text-gray-200 transition hover:bg-white/10"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleGoToSetEditor}
                        className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-base font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                    >
                        저장
                    </button>
                </div>
            </div>
        </Layout>
    );
}
