import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getRoutine, getRoutineById } from "../api/routine";
import { getUserLogsByDate } from "../api/userlog";
import useUserStore from "../stores/userStore";
import Calendar from "../components/Calendar";
import armImg from "../assets/arm.png";

// 한국 시간 기준 YYYY-MM-DD 반환 함수
function getKoreaDateKey(date) {
    const korea = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return korea.toISOString().split("T")[0];
}

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function MainPage() {
    const navigate = useNavigate();
    const { getUserId } = useUserStore();
    const [randomRoutine, setRandomRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [workoutDates, setWorkoutDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 운동 기록 날짜 조회
    useEffect(() => {
        const fetchWorkoutDates = async () => {
            try {
                const userId = getUserId();
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const res = await getUserLogsByDate({ userId, year, month });
                if (res.data.success) {
                    setWorkoutDates(res.data.data);
                }
            } catch (e) {
                setWorkoutDates([]);
            }
        };
        fetchWorkoutDates();
    }, []);

    useEffect(() => {
        const fetchRandomRoutine = async () => {
            try {
                setLoading(true);
                const userId = getUserId();
                
                // 전체 루틴과 사용자 루틴 병합
                const [resAll, resUser] = await Promise.all([
                    getRoutine(),
                    userId ? getRoutineById(userId) : Promise.resolve({ data: { success: true, data: [] } })
                ]);
                
                const allRoutines = resAll.data?.success ? resAll.data.data : [];
                const userRoutines = resUser.data?.success ? resUser.data.data : [];
                
                // userId가 null이거나 로그인한 userId와 같은 루틴만 필터링
                const publicRoutines = allRoutines.filter(routine => 
                    routine.userId === null || routine.userId === userId
                );
                
                // 중복 제거 (사용자 루틴 우선)
                const mergedRoutines = [...userRoutines];
                publicRoutines.forEach(routine => {
                    if (!mergedRoutines.some(r => r.routineId === routine.routineId)) {
                        mergedRoutines.push(routine);
                    }
                });
                
                if (mergedRoutines.length > 0) {
                    const randomIndex = Math.floor(Math.random() * mergedRoutines.length);
                    setRandomRoutine(mergedRoutines[randomIndex]);
                }
            } catch (error) {
                console.error("루틴 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRandomRoutine();
    }, []);

    const handleShowAlert = () => {
        navigate("/workout");
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* video 평가하기 카드 (핵심 기능이므로 상단에 배치) */}
                <div 
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl flex items-center space-x-4 transition transform hover:scale-[1.02] hover:border-purple-400 cursor-pointer"
                    onClick={() => navigate("/feedback")}
                >
                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-xl shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1">AI 자세 분석</h2>
                        <p className="text-sm text-gray-300">영상을 업로드하고 정확한 피드백을 받아보세요.</p>
                    </div>
                </div>

                {/* 랜덤 운동 루틴 카드 */}
                {loading ? (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 overflow-hidden">
                        <div className="flex items-center justify-center min-h-[200px]">
                            <p className="text-gray-300">로딩 중...</p>
                        </div>
                    </div>
                ) : randomRoutine ? (
                    <div 
                        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 overflow-hidden cursor-pointer transition hover:border-purple-400"
                        onClick={() => navigate(`/workout/info/${randomRoutine.routineId}`)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-purple-300 font-semibold">오늘의 추천 루틴</p>
                                <h2 className="text-2xl font-bold">{randomRoutine.name}</h2>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowAlert();
                                }}
                                className="text-sm text-purple-300 hover:text-white font-semibold"
                            >
                                전체 보기
                            </button>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-base font-medium text-gray-300 mb-2">
                                    <span className="text-purple-400">타겟:</span> {randomRoutine.targetMuscle}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {randomRoutine.description || "루틴을 클릭하여 자세히 확인하세요"}
                                </p>
                            </div>
                            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                                {randomRoutine.thumbnailUrl ? (
                                    <img
                                        src={IMAGE_BASE_URL + randomRoutine.thumbnailUrl}
                                        alt="thumb"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={armImg}
                                        alt="default"
                                        className="h-16 w-16 object-contain opacity-60"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 overflow-hidden">
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <p className="text-lg font-semibold text-white mb-2">등록된 루틴이 없습니다</p>
                            <p className="text-sm text-gray-300 mb-4">새로운 루틴을 만들어보세요!</p>
                            <button
                                onClick={() => navigate("/routine")}
                                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                            >
                                루틴 만들기
                            </button>
                        </div>
                    </div>
                )}
                {/* 운동 기록 캘린더 */}
                <div 
                    className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-2xl hover:border-purple-400 transition"
                >
                    <h3 
                        className="text-lg font-bold text-purple-300 mb-3 cursor-pointer"
                        onClick={() => navigate("/my")}
                    >
                        📅 이번 달 운동 기록
                    </h3>
                    <Calendar
                        selectedDate={selectedDate}
                        onSelect={(date) => {
                            console.log("MainPage 캘린더 날짜 클릭:", date);
                            navigate("/my", { state: { selectedDate: date.toISOString() } });
                        }}
                        workoutDates={workoutDates}
                    />
                </div>
            </div>
        </Layout>
    );
}
