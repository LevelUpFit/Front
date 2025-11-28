import api from "./api";

export const uploadExerciseVideo = async ({ userId, exerciseId, video, isPortrait, performedDate, level }) => {
    const formData = new FormData();
    formData.append("userId", String(userId));
    formData.append("exerciseId", String(exerciseId));
    formData.append("video", video);
    formData.append("isPortrait", String(isPortrait));
    formData.append("performedDate", performedDate);
    if (level !== undefined && level !== null) {
        formData.append("level", String(level));
    }

    return api.post("/exercise-feedback/video", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getFeedbackList = async (userId) => {
    return api.get("/exercise-feedback/feedback-list", {
        params: { userId },
    });
};

export const getFeedbackById = async (feedbackId) => {
    return api.get(`/exercise-feedback/get-one/${feedbackId}`);
};