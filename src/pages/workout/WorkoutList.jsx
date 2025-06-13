import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getRoutine, getRoutineById } from "../../api/routine";
import useUserStore from "../../stores/userStore";

import legImg from "../../assets/leg.png";
import backImg from "../../assets/back.png";
import chestImg from "../../assets/chest.png";
import shoulderImg from "../../assets/shoulder.png";

const levelMap = {
    전체: "all",
    초급: 1,
    중급: 2,
    고급: 3,
    내: "my", // 실제로는 userId로 대체
};

const muscleImageMap = {
    등: backImg,
    전신: "/assets/full_body.png",
    가슴: chestImg,
    하체: legImg,
    복부: "/assets/core.png",
    어깨: shoulderImg,
    팔: "/assets/arm.png",
};

const filterPlansByLevel = (plans, levelText, userId) => {
    if (levelText === "내") {
        // userId가 있는 루틴만 필터링
        return plans.filter(plan => plan.userId === userId);
    }
    if (levelText === "전체") {
        return plans;
    }
    const levelValue = levelMap[levelText];
    return plans.filter(plan => plan.difficulty === levelValue);
};

const muscleList = ["전체", "등", "전신", "가슴", "하체", "복부", "어깨", "팔"];

export default function WorkoutList() {
    const [levelText, setLevelText] = useState("전체");
    const [muscle, setMuscle] = useState("전체");
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();
    const { getUserId } = useUserStore();
    const userId = getUserId();

    // 전체 루틴 불러오기
    const fetchWorkoutPlans = async () => {
        try {
            const res = await getRoutine();
            if (res.data.success) {
                setPlans(res.data.data);
            }
        } catch (err) {
            console.error("에러 발생:", err);
        }
    };

    // 내 루틴 불러오기
    const fetchMyPlans = async () => {
        try {
            if (!userId) return;
            const res = await getRoutineById(userId);
            if (res.data.success) {
                setPlans(res.data.data);
            }
        } catch (err) {
            console.error("내 루틴 에러:", err);
        }
    };

    const fetchAllPlans = async () => {
        try {
            const [resAll, resMy] = await Promise.all([
                getRoutine(),
                userId ? getRoutineById(userId) : Promise.resolve({ data: { success: true, data: [] } })
            ]);
            let all = resAll.data.success ? resAll.data.data : [];
            let mine = resMy.data.success ? resMy.data.data : [];
            // routineId 기준으로 중복 제거
            const merged = [...all, ...mine.filter(m => !all.some(a => a.routineId === m.routineId))];
            setPlans(merged);
        } catch (err) {
            console.error("전체+내 루틴 에러:", err);
        }
    };

    useEffect(() => {
        if (levelText === "내") {
            fetchMyPlans();
        } else if (levelText === "전체") {
            fetchAllPlans();
        } else {
            fetchWorkoutPlans();
        }
        // eslint-disable-next-line
    }, [levelText, userId]);

    const filteredPlans = filterPlansByLevel(
        plans.filter(plan => muscle === "전체" ? true : plan.targetMuscle === muscle),
        levelText,
        userId
    );

    return (
        <Layout>
            <div className="relative">
                <BackButton />
                {/* 난이도/부위 셀렉트 영역 */}
                <div className="flex justify-end gap-2 mb-4 mt-2">
                    <select
                        className="border px-3 py-1 rounded-full text-sm"
                        value={levelText}
                        onChange={(e) => setLevelText(e.target.value)}
                    >
                        <option value="전체">전체</option>
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="고급">고급</option>
                        <option value="내">My</option>
                    </select>
                    <select
                        className="border px-3 py-1 rounded-full text-sm"
                        value={muscle}
                        onChange={(e) => setMuscle(e.target.value)}
                    >
                        {muscleList.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <h1 className="text-xl font-bold mb-4">{levelText} 운동 루틴</h1>

                <ul className="space-y-4">
                    {filteredPlans.map((plan) => (
                        <li
                            key={plan.routineId}
                            className={`bg-white rounded-xl px-5 py-4 mb-3 shadow flex items-center relative ${
                                plan.userId === userId ? "border-2 border-blue-400" : ""
                            }`}
                            style={{ minHeight: "88px" }} // 카드 높이 약간 증가
                        >
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold break-words">{plan.name}</h2>
                                <div className="text-sm text-gray-500 break-words">{plan.description}</div>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                                <img
                                    src={muscleImageMap[plan.targetMuscle] || "/assets/default.png"}
                                    alt={plan.targetMuscle}
                                    className="w-16 h-16 object-contain"
                                />
                                <button
                                    onClick={() => navigate(`/workout/info/${plan.routineId}`)}
                                    className="text-blue-600 font-semibold text-sm mt-2"
                                >
                                    전체 보기 →
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
}
