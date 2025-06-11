import api from "./api";

export const saveRoutineLog = async (userId, routineId, performedDate) => {
    const body = {
        userId,
        routineId,
        performedDate
    };
    return api.post('/routines-log/save', body);
};
