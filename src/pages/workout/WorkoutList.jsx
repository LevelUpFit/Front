import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getRoutine, getRoutineById } from "../../api/routine";
import useUserStore from "../../stores/userStore";

import legImg from "../../assets/leg.png";
import backImg from "../../assets/back.png";
import chestImg from "../../assets/chest.png";
import shoulderImg from "../../assets/shoulder.png";
import armImg from "../../assets/arm.png";
import defaultImg from "../../assets/default.png";

const levelMap = {
    전체: "all",
    초급: 1,
    중급: 2,
    고급: 3,
    내: "my", // 실제로는 userId로 대체
};

const muscleImageMap = {
    등: backImg,
    가슴: chestImg,
    하체: legImg,
    어깨: shoulderImg,
    팔: armImg,
    전신: defaultImg,
    복부: defaultImg,
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { getUserId } = useUserStore();
    const userId = getUserId();

    const fetchAllPlans = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [resAll, resMy] = await Promise.all([
                getRoutine(),
                userId ? getRoutineById(userId) : Promise.resolve({ data: { success: true, data: [] } })
            ]);
            const all = resAll.data.success ? resAll.data.data : [];
            const mine = resMy.data.success ? resMy.data.data : [];
            const merged = [...all, ...mine.filter((m) => !all.some((a) => a.routineId === m.routineId))];
            setPlans(merged);
        } catch (err) {
            console.error("전체+내 루틴 에러:", err);
            setError("루틴 정보를 불러오지 못했어요.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchAllPlans();
    }, [fetchAllPlans]);

    const filteredPlans = useMemo(() => {
        const byLevel = filterPlansByLevel(plans, levelText, userId);
        return byLevel.filter((plan) => (muscle === "전체" ? true : plan.targetMuscle === muscle));
    }, [plans, levelText, muscle, userId]);

    const visibleRoutineCount = isLoading ? "..." : filteredPlans.length;

    const difficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 1:
                return "초급";
            case 2:
                return "중급";
            case 3:
                return "고급";
            default:
                return "전체";
        }
    };

    const getMuscleImage = (targetMuscle) => {
        const image = muscleImageMap[targetMuscle];
        return image || defaultImg;
    };

    const handlePlanClick = (routineId) => {
        navigate(`/workout/info/${routineId}`);
    };

    return (
        <Layout>
            <div className="flex flex-col gap-5 p-0">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-700/60 via-indigo-700/60 to-gray-900/40 p-5 shadow-xl backdrop-blur-xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-purple-200">오늘의 루틴</p>
                            <h1 className="mt-1 text-2xl font-bold text-white">{levelText} 운동 루틴</h1>
                            <p className="mt-2 text-sm text-gray-300">
                                총 {visibleRoutineCount}개의 루틴을 확인할 수 있어요.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
                            aria-label="뒤로가기"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden="true">
                        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-purple-500 blur-3xl" />
                        <div className="absolute -top-6 left-1/3 h-24 w-24 rounded-full bg-indigo-500 blur-3xl" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="w-1/2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-lg transition focus:border-purple-400 focus:outline-none"
                        value={levelText}
                        onChange={(e) => setLevelText(e.target.value)}
                    >
                        <option value="전체">전체 레벨</option>
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="고급">고급</option>
                        <option value="내">My 루틴</option>
                    </select>
                    <select
                        className="w-1/2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-lg transition focus:border-purple-400 focus:outline-none"
                        value={muscle}
                        onChange={(e) => setMuscle(e.target.value)}
                    >
                        {muscleList.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center py-16">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-gray-300 backdrop-blur-lg">
                            루틴을 불러오는 중입니다...
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-center text-rose-100 backdrop-blur-lg">
                        {error}
                    </div>
                ) : filteredPlans.length === 0 ? (
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-gray-300 backdrop-blur-lg">
                        선택한 조건에 맞는 루틴이 없습니다.
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {filteredPlans.map((plan) => (
                            <li
                                key={plan.routineId}
                                onClick={() => handlePlanClick(plan.routineId)}
                                className={`group flex cursor-pointer items-center gap-4 rounded-2xl border bg-white/10 p-4 shadow-xl backdrop-blur-lg transition duration-200 hover:border-purple-400/80 hover:bg-white/15 ${
                                    plan.userId === userId ? "border-purple-400/60" : "border-white/20"
                                }`}
                            >
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-black/20">
                                    <img
                                        src={getMuscleImage(plan.targetMuscle)}
                                        alt={plan.targetMuscle || "루틴 이미지"}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 text-white">
                                    <div className="flex items-center gap-2">
                                        <h2 className="truncate text-lg font-semibold">{plan.name}</h2>
                                        {plan.userId === userId && (
                                            <span className="rounded-full border border-purple-400/40 bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-100">
                                                My
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 truncate text-sm text-gray-300">
                                        {plan.description || "설명 준비 중입니다."}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-purple-200">
                                            {plan.targetMuscle || "전체"}
                                        </span>
                                        <span className="rounded-full border border-purple-300/40 bg-purple-400/10 px-2 py-0.5 text-purple-200">
                                            {difficultyLabel(plan.difficulty)}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-auto flex flex-col items-end gap-2 text-sm text-purple-200">
                                    <span className="hidden items-center gap-1 group-hover:flex">
                                        자세히 보기
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
