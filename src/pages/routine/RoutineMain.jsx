// RoutineMain.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import armImg from "../../assets/arm.png";
import { getRoutineById, deleteRoutine } from "../../api/routine"; // 수정: deleteRoutine 추가
import useUserStore from "../../stores/userStore";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function RoutineMain() {
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupId, setPopupId] = useState(null); // 팝업 표시용
    const { getUserId } = useUserStore();

    const fetchRoutines = async () => {
        const userId = getUserId();
        try {
            const res = await getRoutineById(userId);
            if (res.data && res.data.success) {
                setRoutines(res.data.data || []);
            } else {
                setRoutines([]);
            }
        } catch {
            setRoutines([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
        // eslint-disable-next-line
    }, []);

    // 팝업 외부 클릭 시 닫기
    useEffect(() => {
        if (popupId === null) return;
        const handleClick = (e) => {
            // 팝업 또는 ...버튼이 아닌 곳 클릭 시 닫기
            if (
                !e.target.closest(".routine-popup") &&
                !e.target.closest(".routine-popup-btn")
            ) {
                setPopupId(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [popupId]);

    // 실제 삭제 API 연결
    const handleDelete = async (routineId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteRoutine(routineId);
            setRoutines(routines.filter(r => r.routineId !== routineId));
            setPopupId(null);
        } catch (e) {
            alert("삭제에 실패했습니다.");
        }
    };

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
                                    key={routine.routineId}
                                    className="bg-white rounded-xl p-5 flex items-center shadow justify-between hover:shadow-lg transition relative cursor-pointer"
                                    onClick={() => navigate(`/workout/info/${routine.routineId}`)} // 카드 클릭 시 이동
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 overflow-hidden">
                                            {routine.thumbnailUrl ? (
                                                <img
                                                    src={IMAGE_BASE_URL + routine.thumbnailUrl}
                                                    alt="thumb"
                                                    className="w-12 h-12 object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={armImg}
                                                    alt="default"
                                                    className="w-10 h-10 object-contain opacity-60"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-base truncate">{routine.name}</div>
                                            <div className="text-xs text-blue-600 truncate">{routine.targetMuscle}</div>
                                        </div>
                                    </div>
                                    {/* 카드 우측 상단 ... 버튼 */}
                                    <button
                                        className="routine-popup-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition ml-2"
                                        onClick={e => {
                                            e.stopPropagation(); // 카드 클릭 방지
                                            setPopupId(popupId === routine.routineId ? null : routine.routineId);
                                        }}
                                    >
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                            <circle cx="5" cy="12" r="2" fill="#888" />
                                            <circle cx="12" cy="12" r="2" fill="#888" />
                                            <circle cx="19" cy="12" r="2" fill="#888" />
                                        </svg>
                                    </button>
                                    {/* 팝업 메뉴 */}
                                    {popupId === routine.routineId && (
                                        <div className="routine-popup absolute top-12 right-4 z-20 bg-white border rounded-xl shadow-lg py-2 w-28 flex flex-col">
                                            <button
                                                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 text-left"
                                                onClick={() => {
                                                    setPopupId(null);
                                                    navigate(`/routine/edit/${routine.routineId}`);
                                                }}
                                            >
                                                수정
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleDelete(routine.routineId);
                                                }}
                                            >
                                                삭제
                                            </button>
                                            <button
                                                className="px-4 py-2 text-xs text-gray-400 hover:bg-gray-50 text-left"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setPopupId(null);
                                                }}
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    )}
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
