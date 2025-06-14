import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { getExerciseById } from "../../api/exercise";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function ExerciseInfo() {
    const { exerciseId } = useParams();
    const [exercise, setExercise] = useState(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const res = await getExerciseById(exerciseId);
                if (res.data.success) {
                    setExercise(res.data.data);
                }
            } catch (e) {
                setExercise(null);
            }
        };
        fetchExercise();
    }, [exerciseId]);

    useEffect(() => {
        div.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <div className="flex flex-col min-h-screen px-4 py-6 pb-24">
                {!exercise ? (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="mt-8 text-gray-500">운동 정보를 불러오는 중입니다...</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center flex-1">
                        <img
                            src={IMAGE_BASE_URL + exercise.thumbnailUrl}
                            alt={exercise.name}
                            className="w-32 h-32 object-contain rounded-xl bg-white shadow mb-4"
                        />
                        <h2 className="text-2xl font-bold mb-2">{exercise.name}</h2>
                        <div className="text-blue-700 font-semibold mb-2">
                            타겟 근육: {exercise.targetMuscle}
                        </div>
                        <div className="bg-white rounded-xl shadow p-4 w-full max-w-md text-gray-700 mb-4">
                            {exercise.description}
                        </div>
                        {exercise.feedbackAvailable === false && (
                            <div className="text-xs text-gray-400 mt-2">
                                피드백 기능 미지원 운동입니다.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}