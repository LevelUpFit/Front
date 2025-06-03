import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/api";

export default function WorkoutSession() {
    const { muscle } = useParams();
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sets, setSets] = useState([]); // 각 운동의 세트 정보
    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await api.get(`/exercise/group/${muscle}`);
                if (res.data.success) {
                    setExercises(res.data.data);
                    setSets(
                        res.data.data.map(() => [
                            { set: 1, weight: 30, reps: 12, done: false },
                            { set: 2, weight: 30, reps: 12, done: false },
                        ])
                    );
                }
            } catch (err) {
                console.error("운동 불러오기 실패", err);
            }
        };
        fetchExercises();
    }, [muscle]);

    const current = exercises[currentIndex];

    const addSet = () => {
        setSets(prev => {
            const updated = [...prev];
            const currentExerciseSets = updated[currentIndex];
            const newSet = {
                set: currentExerciseSets.length + 1,
                weight: 30,
                reps: 12,
                done: false
            };
            updated[currentIndex] = [...currentExerciseSets, newSet];
            return updated;
        });
    };

    const handleNextSet = async () => {
        const currentExercise = exercises[currentIndex];
        const currentSet = sets[currentIndex][currentSetIndex];

        try {
            await api.post("/record", {
                exerciseId: currentExercise.id,
                weight: currentSet.weight,
                reps: currentSet.reps,
                set: currentSet.set,
                date: new Date().toISOString().split("T")[0],
            });

            setSets(prev => {
                const updated = [...prev];
                updated[currentIndex][currentSetIndex].done = true;
                return updated;
            });

            if (currentSetIndex < sets[currentIndex].length - 1) {
                setCurrentSetIndex(currentSetIndex + 1);
            } else if (currentIndex < exercises.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setCurrentSetIndex(0);
            } else {
                navigate("/workout/summary");
            }
        } catch (err) {
            console.error("자동 저장 실패", err);
        }
    };

    if (!current) return <Layout>로딩 중...</Layout>;

    return (
        <Layout>
            <div className="text-lg font-bold text-center mb-2">{muscle} 운동 1</div>

            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{current.name}</span>
                <span className="text-sm text-gray-500">{current.targetMuscle}</span>
            </div>

            <img src={current.imageUrl || "/assets/default.png"} alt="ex" className="w-full h-40 object-contain" />

            <div className="space-y-2 mt-4">
                {sets[currentIndex].map((set, idx) => (
                    <div
                        key={idx}
                        className={`flex justify-between items-center px-4 py-2 rounded-lg ${
                            set.done ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span>{set.set}</span>
                            <span>{set.weight}kg</span>
                            <span>{set.reps}회</span>
                        </div>
                        <span>{set.done ? "✔" : "○"}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={addSet}
                className="w-full text-center text-gray-600 py-2 mt-4 bg-gray-100 rounded"
            >
                + 세트 추가
            </button>

            <button
                onClick={handleNextSet}
                className="w-full bg-blue-600 text-white py-3 rounded mt-6"
            >
                다음 세트
            </button>
        </Layout>
    );
}
