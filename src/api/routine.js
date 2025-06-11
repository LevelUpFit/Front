import api from "./api";


export const getRoutine = async () => {
    return api.get(`/routine`);
}

export const getRoutineById = async (id) => {
    return api.get(`/routine/detail/${id}`);
}