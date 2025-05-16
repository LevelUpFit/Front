import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import Calendar from "../components/Calendar";
import WorkoutSummary from "../components/WorkoutSummary";
import FeedbackCard from "../components/FeedbackCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import Layout from "../components/Layout";

export default function MyPage() {
    const { workoutsByDate } = useUserStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);

    const dateKey = selectedDate.toISOString().split("T")[0];
    const workoutData = workoutsByDate[dateKey];

    useEffect(() => {
        setShowAddModal(!workoutData);
    }, [selectedDate, workoutData]);

    return (
        <Layout>
            <div className="flex flex-col px-4 py-6 space-y-4">
                <Calendar
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    workoutDates={Object.keys(workoutsByDate)}
                />

                {workoutData && (
                    <>
                        <WorkoutSummary data={workoutData} />
                        <FeedbackCard feedback={workoutData.feedback} />
                    </>
                )}

                {showAddModal && (
                    <AddWorkoutModal date={dateKey} onClose={() => setShowAddModal(false)} />
                )}
            </div>
        </Layout>
    );
}
