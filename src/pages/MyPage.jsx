import { useState } from "react";
import useUserStore from "../stores/userStore";
import Calendar from "../components/Calendar";
import FeedbackCard from "../components/FeedbackCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const { workoutsByDate, removeWorkoutByDate } = useUserStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    const dateKey = selectedDate.toISOString().split("T")[0];
    const workoutData = workoutsByDate?.[dateKey];

    const openAddModal = (isEdit = false) => {
        setEditMode(isEdit);
        setShowAddModal(true);
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
                        onSelect={setSelectedDate}
                        workoutDates={Object.keys(workoutsByDate || {})}
                    />
                </div>

                {/* 피드백 카드만 표시 */}
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
