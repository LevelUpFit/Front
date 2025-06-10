import api from "./api";

export const login = async (email, password) => {
    return api.post("/user/login", {
        email,
        pwd: password,
    });
};

export const checkEmail = async (email) => {
    return api.post("/user/checkEmail", { email });
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    return api.patch("/user/password", {
        userId,
        oldPassword: oldPassword,
        newPassword: newPassword,
    });
};

export const signup = async (userData) => {
    return api.post("/user/register", userData);
};
