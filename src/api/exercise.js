import api from "./apiDev";

export const createExercise = async ({ name, description, targetMuscle }) => {
    return api.post("/exercise/create", {
        name,
        description,
        targetMuscle,
    });
};

export const getExercisesByLevel = async (level) => {
    const res = await api.get(`/exercises?level=${level}`);
    return res.data;
};

//루틴 내 운동 조회
export const getRoutineExercises = async (routineId) => {
    return await api.get(`/routines-exercises/${routineId}`);
}

//운동 단일 조히
export const getExerciseById = async (exerciseId) => {
    return await api.get(`/exercise/${exerciseId}`);
};