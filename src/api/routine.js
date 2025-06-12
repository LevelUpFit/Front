import api from "./apiDev";


export const getRoutine = async () => {
    return api.get(`/routine`);
}

export const getRoutineById = async (id) => {
    return api.get(`/routine/detail/${id}`);
}

//루틴 생성
export const createRoutine = async (routineData) => {
    return api.post(`/routine/create`, routineData);
}

// 여러 루틴 운동 등록
export const createRoutinesExercise = async (routineExercises) => {
    return api.post(`/routines-exercises`, routineExercises);
}