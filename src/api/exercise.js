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

//운동 전체 조회
export const getAllExercises = async () => {
    return await api.get("/exercise");
};

//루틴 내 운동 조회
export const getRoutineExercises = async (routineId) => {
    return await api.get(`/routines-exercises/${routineId}`);
}

//운동 단일 조히
export const getExerciseById = async (exerciseId) => {
    return await api.get(`/exercise/${exerciseId}`);
};

// 운동 로그 저장
export const saveExerciseLog = async (exerciseLog) => {
    return await api.post("/exercise-log/save", exerciseLog);
};

// 운동 루틴 수정
export const patchRoutinesExercise = async (data) => {
    return await api.patch("/routines-exercises", data);
};

//피드백 가능 운동 조회
export const getFeedbackAvailableExercises = async () => {
    return await api.get("/exercise/feedback-exercise");
};