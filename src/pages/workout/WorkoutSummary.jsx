import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/api";

export default function WorkoutSummary() {
    const navigate = useNavigate();
    const location = useLocation();
    const { exercises = [], startTime, endTime, muscle } = location.state || {};

    const [totalWeight, setTotalWeight] = useState(0);
    const [duration, setDuration] = useState("00:00");
    const today = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        let weight = 0;
        exercises.forEach((ex) => {
            ex.sets.forEach((set) => {
                weight += set.weight * set.reps;
            });
        });
        setTotalWeight(weight);

        if (startTime && endTime) {
            const diff = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
            const min = String(Math.floor(diff / 60)).padStart(2, "0");
            const sec = String(diff % 60).padStart(2, "0");
            setDuration(`${min}:${sec}`);
        }
    }, [exercises, startTime, endTime]);

    const handleSave = async () => {
        try {
            await api.post("/record/save-summary", {
                muscle,
                totalWeight,
                duration,
                date: today,
                exercises,
            });
            alert("기록 저장 완료!");
            navigate("/main");
        } catch (err) {
            console.error("요약 저장 실패", err);
            alert("저장에 실패했습니다.");
        }
    };

    return (
        <Layout>
            <div className="bg-blue-600 text-white text-center py-6 text-xl font-bold rounded-xl mb-4">
                오늘도 득근 성공!!
            </div>

            <div className="bg-white rounded-xl p-4 mb-4 text-center shadow">
                <div className="text-xl font-bold mb-2">{muscle} 운동 1</div>
                <div className="flex justify-around text-sm">
                    <div>
                        <div className="font-bold text-lg">{totalWeight}Kg</div>
                        <div className="text-gray-500">총 무게</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg">{duration}</div>
                        <div className="text-gray-500">시간</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg">{today}</div>
                        <div className="text-gray-500">날짜</div>
                    </div>
                </div>
            </div>

            {exercises.map((ex, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 mb-3 shadow">
                    <div className="flex items-center gap-3">
                        <img src={ex.imageUrl || "/assets/default.png"} alt="img" className="w-16 h-16 object-contain" />
                        <div>
                            <div className="font-bold text-lg">{ex.name}</div>
                            <div className="text-sm text-gray-600">
                                {ex.sets.length} 세트 x {ex.sets[0].reps}회
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleSave}
                className="w-full py-3 mt-6 bg-blue-600 text-white rounded text-lg font-semibold"
            >
                저장하기
            </button>
        </Layout>
    );
}
