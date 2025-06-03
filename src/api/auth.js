import api from "./api";

export const login = async (email, password) => {
    return api.post("/user/login", {
        email,
        pwd: password,
    });
};

export const signup = async (userData) => {
    return api.post("/user/register", userData);
};
