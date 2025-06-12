// RoutineMain.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import armImg from "../../assets/arm.png";
import { getRoutineById } from "../../api/routine";
import useUserStore from "../../stores/userStore";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function RoutineMain() {
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getUserId } = useUserStore();

    useEffect(() => {
        // 예시: 사용자 ID가 필요하다면 localStorage 등에서 가져오세요
        const userId = getUserId();
        getRoutineById(userId)
            .then(res => {
                if (res.data && res.data.success) {
                    setRoutines(res.data.data || []);
                } else {
                    setRoutines([]);
                }
            })
            .catch(() => setRoutines([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="p-4 text-center">로딩 중...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">개인 루틴</h1>
                {(!routines || routines.length === 0) ? (
                    <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow">
                        <img src={armImg} alt="muscle" className="w-24 h-24"/>
                        <p className="text-lg font-semibold mb-2">나만의 루틴 생성하기</p>
                        <button
                            onClick={() => navigate("/routine/edit/new")}
                            className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full"
                        >
                            + 시작
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 mb-6">
                            {routines.map(routine => (
                                <div
                                    key={routine.id}
                                    className="bg-white rounded-xl p-6 flex items-center shadow justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        {routine.thumbnailUrl && (
                                            <img src={IMAGE_BASE_URL+routine.thumbnailUrl} alt="thumb" className="w-16 h-16 rounded-full object-cover bg-gray-100"/>
                                        )}
                                        <div>
                                            <div className="font-bold text-lg">{routine.name}</div>
                                            <div className="text-sm text-blue-600">{routine.targetMuscle}</div>
                                        </div>
                                    </div>
                                    {/* 루틴 상세로 이동 등 원하는 동작 추가 */}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate("/routine/edit/new")}
                            className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full w-full"
                        >
                            + 루틴 추가
                        </button>
                    </>
                )}
            </div>
        </Layout>
    );
}
