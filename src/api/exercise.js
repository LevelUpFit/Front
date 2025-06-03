import api from "./api";

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
