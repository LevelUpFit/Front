import api from "./api";

export const saveRoutineLog = async (userId, routineId, performedDate) => {
    const body = {
        userId,
        routineId,
        performedDate
    };
    return api.post('/routines-log/save', body);
};

// 한국 시간 기준으로 userId, year, month를 GET 파라미터로 조회
export const getUserLogsByDate = async ({ userId, year, month }) => {
    return api.get('/user-logs/date', {
        params: {
            userId,
            year,
            month
        }
    });
};

export const getUserLogDetailByDate = async ({ userId, performedDate }) => {
    return api.get('/user-logs/date-detail', {
        params: {
            userId,
            performedDate
        }
    });
};
