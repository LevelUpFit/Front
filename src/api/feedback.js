import api from "./api";

export const uploadExerciseVideo = async ({ userId, exerciseId, video, isPortrait, performedDate, level }) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("exerciseId", exerciseId);
    formData.append("video", video);
    formData.append("isPortrait", isPortrait);
    formData.append("performedDate", performedDate);
    formData.append("level", level);

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