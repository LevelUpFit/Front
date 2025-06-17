import { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import Calendar from "../components/Calendar";
import FeedbackCard from "../components/FeedbackCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { getUserLogsByDate, getUserLogDetailByDate, deleteRoutineLog, deleteExerciseLog } from "../api/userlog";
import { saveExerciseLog } from "../api/exercise";
import { SwipeableList, SwipeableListItem } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import AddExerciseModal from "../components/AddExerciseModal"; // 필요시 삭제
// Modal import 제거
// import Modal from "../components/Modal"; 

// 한국 시간 기준 YYYY-MM-DD 반환 함수
function getKoreaDateKey(date) {
    const korea = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return korea.toISOString().split("T")[0];
}

export default function MyPage() {
    const { getUserId } = useUserStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [workoutDates, setWorkoutDates] = useState([]);
    const [workoutData, setWorkoutData] = useState(null);
    const [exerciseNames, setExerciseNames] = useState(""); // 콤마로 입력받는 운동명
    const [targetMuscle, setTargetMuscle] = useState("하체");
    const [feedback, setFeedback] = useState("노오력이 부족");
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [editExerciseData, setEditExerciseData] = useState(null); // 수정용 데이터
    const navigate = useNavigate();

    const dateKey = getKoreaDateKey(selectedDate);

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
    }, [getUserId]);

    const handleSelectDate = async (date) => {
        setSelectedDate(date);
        const userId = getUserId();
        const performedDate = getKoreaDateKey(date);
        try {
            const res = await getUserLogDetailByDate({ userId, performedDate });
            if (res.data.success) {
                setWorkoutData(res.data.data);
            } else {
                setWorkoutData(null);
            }
        } catch (e) {
            setWorkoutData(null);
        }
    };

    // 달력에서 월이 바뀔 때 호출
    const handleMonthChange = async ({ activeStartDate }) => {
        try {
            const userId = getUserId();
            const year = activeStartDate.getFullYear();
            const month = activeStartDate.getMonth() + 1;
            const res = await getUserLogsByDate({ userId, year, month });
            if (res.data.success) {
                setWorkoutDates(res.data.data);
            }
        } catch (e) {
            setWorkoutDates([]);
        }
    };

    // 삭제 핸들러 함수 수정
    const handleDeleteLog = async (log, idx) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                if (log.log_type === "ROUTINE" && log.id) {
                    await deleteRoutineLog(log.id );
                } else if (log.log_type === "EXERCISE" && log.id) {
                    await deleteExerciseLog(log.id );
                }
                setWorkoutData(prev => prev.filter((_, i) => i !== idx));
                alert("삭제 성공");
            } catch (e) {
                alert("삭제 실패");
            }
        }
    };

    // 운동 추가/수정 모달 열기
    const openAddModal = (edit = false, data = null) => {
        setEditExerciseData(edit ? data : null);
        setShowAddModal(true);
    };

    // 운동 추가/수정 모달 닫기
    const closeAddModal = () => {
        setShowAddModal(false);
        setEditExerciseData(null);
    };

    // 운동 추가/수정 완료 시
    const handleAddOrEditExercise = async (newWorkout) => {
        // 저장 후 해당 날짜의 기록을 다시 조회
        const userId = getUserId();
        const performedDate = getKoreaDateKey(selectedDate);
        try {
            const res = await getUserLogDetailByDate({ userId, performedDate });
            if (res.data.success) {
                setWorkoutData(res.data.data);
            } else {
                setWorkoutData(null);
            }
        } catch (e) {
            setWorkoutData(null);
        }
        setShowAddModal(false);
        setEditExerciseData(null);
    };

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
                        onSelect={handleSelectDate}
                        workoutDates={workoutDates}
                        onActiveStartDateChange={handleMonthChange}
                    />
                </div>

                <button
                    className="w-full bg-white rounded-xl py-3 font-semibold shadow"
                    onClick={() => openAddModal(false)}
                >
                    운동 기록하기
                </button>

                {/* 운동 추가/수정 입력 모달 */}
                {showAddModal && (
                    <AddWorkoutModal
                        date={getKoreaDateKey(selectedDate)}
                        onClose={closeAddModal}
                        onSave={handleAddOrEditExercise}
                        initialData={editExerciseData}
                    />
                )}

                {/* 운동 상세 데이터 표시 */}
                {workoutData?.feedback && (
                    <div className="space-y-4">
                        <FeedbackCard feedback={workoutData.feedback} />
                        <div className="flex justify-end gap-2 px-2">
                            <button
                                onClick={() => openAddModal(true, {
                                    name: workoutData.name,
                                    targetMuscle: workoutData.targetMuscle,
                                    feedback: workoutData.feedback,
                                })}
                                className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded"
                            >
                                수정
                            </button>
                            <button
                                onClick={async () => {
                                    if (confirm("정말 삭제하시겠습니까?")) {
                                        try {
                                            // 루틴 기록 삭제
                                            if (workoutData.logId) {
                                                await deleteRoutineLog({ logId: workoutData.logId });
                                            }
                                            // 운동 기록 삭제
                                            if (workoutData.exerciseLogId) {
                                                await deleteExerciseLog({ exerciseLogId: workoutData.exerciseLogId });
                                            }
                                            setWorkoutData(null);
                                        } catch (e) {
                                            alert("삭제 실패");
                                        }
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
                            <div key={idx} className="bg-white rounded-lg shadow p-3 flex flex-col gap-1 relative">
                                <button
                                    className="absolute top-2 right-2 text-red-500 font-bold"
                                    onClick={() => handleDeleteLog(log, idx)}
                                >
                                    삭제
                                </button>
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
            </div>
        </Layout>
    );
}
