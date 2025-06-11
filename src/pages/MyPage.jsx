import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import Calendar from "../components/Calendar";
import FeedbackCard from "../components/FeedbackCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { getUserLogsByDate, getUserLogDetailByDate } from "../api/userlog";

// 한국 시간 기준 YYYY-MM-DD 반환 함수
function getKoreaDateKey(date) {
    const korea = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return korea.toISOString().split("T")[0];
}

export default function MyPage() {
    const { workoutsByDate, removeWorkoutByDate, getUserId } = useUserStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [workoutDates, setWorkoutDates] = useState([]);
    const [workoutData, setWorkoutData] = useState(null); // ← 추가
    const navigate = useNavigate();

    // 항상 한국 시간 기준으로 dateKey 생성
    const dateKey = getKoreaDateKey(selectedDate);

    // 날짜 불러오기
    useEffect(() => {
        const fetchWorkoutDates = async () => {
            try {
                const userId = getUserId();
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const res = await getUserLogsByDate({ userId, year, month });
                if (res.data.success) {
                    setWorkoutDates(res.data.data); // ["YYYY-MM-DD", ...]
                }
            } catch (e) {
                setWorkoutDates([]);
            }
        };
        fetchWorkoutDates();
    }, [getUserId]);

    // 날짜 클릭 시 운동 상세 조회
    const handleSelectDate = async (date) => {
        setSelectedDate(date);
        const userId = getUserId();
        const performedDate = getKoreaDateKey(date);
        try {
            const res = await getUserLogDetailByDate({ userId, performedDate });
            if (res.data.success) {
                setWorkoutData(res.data.data); // 상세 데이터 저장
            } else {
                setWorkoutData(null);
            }
        } catch (e) {
            setWorkoutData(null);
        }
    };

    const openAddModal = (isEdit = false) => {
        setEditMode(isEdit);
        setShowAddModal(true);
    };

    // 날짜를 YYYY-MM-DD로 변환해서 비교
    const isWorkoutDay = (dateObj) => {
        const yyyyMMdd = dateObj.toISOString().slice(0, 10);
        return workoutDates.includes(yyyyMMdd);
    };

    useEffect(() => {
        // 오늘 날짜 운동 기록 자동 조회
        const fetchTodayWorkout = async () => {
            const userId = getUserId();
            const today = new Date();
            const performedDate = getKoreaDateKey(today);
            try {
                const res = await getUserLogDetailByDate({ userId, performedDate });
                if (res.data.success) {
                    setWorkoutData(res.data.data);
                    setSelectedDate(today); // 오늘 날짜로 선택
                } else {
                    setWorkoutData(null);
                    setSelectedDate(today);
                }
            } catch (e) {
                setWorkoutData(null);
                setSelectedDate(today);
            }
        };
        fetchTodayWorkout();
    }, [getUserId]);

    return (
        <Layout>
            <div className="flex flex-col min-h-screen px-4 py-6 bg-gray-200 space-y-4 overflow-y-auto">
                {/* 상단 사용자 정보 */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">헬린이123 님</h2>
                    <div className="mt-4 space-y-3">
                        <button
                            className="w-full bg-white rounded-xl py-3 font-semibold shadow"
                            onClick={() => openAddModal(false)}
                        >
                            루틴 기록하기
                        </button>
                        <button
                            onClick={() => navigate("/account")}
                            className="w-full bg-white rounded-xl py-3 font-semibold shadow"
                        >
                            계정 정보 보기
                        </button>
                    </div>
                </div>

                {/* 달력 */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <Calendar
                        selectedDate={selectedDate}
                        onSelect={handleSelectDate} // ← 변경
                        workoutDates={workoutDates} // ["2025-06-12", ...] 그대로 전달
                    />
                </div>

                {/* 운동 상세 데이터 표시 */}
                {workoutData?.feedback && (
                    <div className="space-y-4">
                        <FeedbackCard feedback={workoutData.feedback} />
                        <div className="flex justify-end gap-2 px-2">
                            <button
                                onClick={() => openAddModal(true)}
                                className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("정말 삭제하시겠습니까?")) {
                                        removeWorkoutByDate(dateKey);
                                    }
                                }}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                )}

                {/* 운동 기록 리스트 표시 */}
                {Array.isArray(workoutData) && workoutData.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <h3 className="font-bold text-lg mb-2">운동 기록</h3>
                        {workoutData.map((log, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow p-3 flex flex-col gap-1"
                            >
                                <div className="font-semibold">{log.name}</div>
                                <div className="text-sm text-gray-600">
                                    {log.log_type === "ROUTINE" ? "루틴 기록" : "운동 기록"}
                                </div>
                                <div className="text-xs text-gray-400">
                                    날짜: {log.performed_date}
                                </div>
                                {log.target_muscle && (
                                    <div className="text-xs text-gray-500">
                                        타겟 근육: {log.target_muscle}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 운동 추가/수정 모달 */}
                {showAddModal && (
                    <AddWorkoutModal
                        date={dateKey}
                        initialData={editMode ? workoutData : null}
                        onClose={() => setShowAddModal(false)}
                    />
                )}
            </div>
        </Layout>
    );
}
