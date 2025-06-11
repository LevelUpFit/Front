import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getRoutine } from "../../api/routine";

import legImg from "../../assets/leg.png";
import backImg from "../../assets/back.png";
import chestImg from "../../assets/chest.png";
import shoulderImg from "../../assets/shoulder.png";

const levelMap = {
    초급: 1,
    중급: 2,
    고급: 3,
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

export default function WorkoutList() {
    const [levelText, setLevelText] = useState("초급");
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    const fetchWorkoutPlans = async (levelValue) => {
        try {
            const res = await getRoutine();
            console.log("API 응답:", res);
            if (res.data.success) {
                setPlans(res.data.data);
            }
        } catch (err) {
            console.error("에러 발생:", err);
        }
    };

    useEffect(() => {
        const levelValue = levelMap[levelText];
        if (levelValue) fetchWorkoutPlans(levelValue);
    }, [levelText]);

    useEffect(() => {
        if (plans.length === 0) {
            console.log("❗ plans가 비어있습니다. API 응답 또는 파싱을 확인하세요.");
        } else {
            console.log("✅ plans 데이터:", plans);
        }
    }, [plans]);

    return (
        <Layout>
            <div className="relative">
                <BackButton />
                {/* 셀렉트 영역 */}
                <div className="flex justify-end mb-4">
                    <select
                        className="border px-3 py-1 rounded-full text-sm"
                        value={levelText}
                        onChange={(e) => setLevelText(e.target.value)}
                    >
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="고급">고급</option>
                        <option value="내">My</option>
                    </select>
                </div>

                <h1 className="text-xl font-bold mb-4">{levelText} 운동 루틴</h1>

                <ul className="space-y-4">
                    {plans.map((plan) => (
                        <li key={plan.id} className="bg-white rounded-xl p-4 mb-4 shadow">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h2 className="text-lg font-bold">{plan.name}</h2>
                                    <div className="text-sm text-gray-500">{plan.description}</div>
                                </div>
                                <img
                                    src={muscleImageMap[plan.targetMuscle] || "/assets/default.png"}
                                    alt={plan.targetMuscle}
                                    className="w-16 h-16 object-contain"
                                />
                            </div>
                            {/* 필요하다면 추가 정보 출력 */}
                            <div className="text-right mt-2">
                                <button
                                    onClick={() => navigate(`/workout/info/${plan.routineId}`)}
                                    className="text-blue-600 font-semibold"
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
