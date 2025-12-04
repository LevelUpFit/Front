import api from "./api";

export const saveRoutineLog = async (logData) => {
    return api.post('/routines-log/save', logData);
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

//운동 기록 삭제제
export const deleteExerciseLog = async (exerciseLogId) => {
    return api.delete('/exercise-log', {
        data: { exerciseLogId }
    });
};

//루틴 기록 삭제
export const deleteRoutineLog = async (logId) => {
    return api.delete('/routines-log', {
        data: { logId }
    });
};

// 단일 기록 상세 조회
export const getUserLogDetail = async (logId, logType) => {
    return api.get(`/user-logs/detail/${logId}`, {
        params: { logType }
    });
};