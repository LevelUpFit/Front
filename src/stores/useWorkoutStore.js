// src/stores/useWorkoutStore.js
import { create } from 'zustand';

const useWorkoutStore = create((set) => ({
    workouts: {
        // 예: "2025-05-05": { part: "가슴", routine: [...], feedback: "..." }
    },
    setWorkouts: (data) => set({ workouts: data }),
    addWorkout: (date, workoutData) =>
        set((state) => ({
            workouts: {
                ...state.workouts,
                [date]: workoutData,
            },
        })),
}));

export default useWorkoutStore;
