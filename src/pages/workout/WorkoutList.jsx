import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";

const levelMap = {
    초급: 1,
    중급: 2,
    고급: 3,
};

const muscleImageMap = {
    등: "/assets/back_muscle.png",
    전신: "/assets/full_body.png",
    가슴: "/assets/chest.png",
    하체: "/assets/leg.png",
    복부: "/assets/core.png",
    어깨: "/assets/shoulder.png",
    팔: "/assets/arm.png",
};

export default function WorkoutList() {
    const [levelText, setLevelText] = useState("초급");
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    const fetchWorkoutPlans = async (levelValue) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/exercise?level=${levelValue}`
            );
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

    // 부위별 그룹핑
    const groupedPlans = plans.reduce((acc, plan) => {
        const key = plan.targetMuscle;
        if (!acc[key]) acc[key] = [];
        acc[key].push(plan);
        return acc;
    }, {});

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
                    </select>
                </div>

                <h1 className="text-xl font-bold mb-4">{levelText} 운동 루틴</h1>

                {Object.entries(groupedPlans).map(([muscle, items]) => (
                    <div key={muscle} className="bg-white rounded-xl p-4 mb-4 shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold">{muscle} 운동</h2>
                            <img
                                src={muscleImageMap[muscle] || "/assets/default.png"}
                                alt={muscle}
                                className="w-16 h-16 object-contain"
                            />
                        </div>

                        <ul className="list-disc list-inside text-sm text-gray-700">
                            {items.map((ex) => (
                                <li key={ex.id}>{ex.name}</li>
                            ))}
                        </ul>

                        {/* 전체 보기 버튼 추가 */}
                        <div className="text-right mt-2">
                            <button
                                onClick={() => navigate(`/workout/group/${muscle}`)}
                                className="text-blue-600 font-semibold"
                            >
                                전체 보기 →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
