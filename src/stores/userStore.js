import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,

    setUser: ({ email, nickname, kakaoId, profile }) => {
        const userInfo = { email, nickname, kakaoId, profile };
        localStorage.setItem("user", JSON.stringify(userInfo));
        set({ user: userInfo });
    },

    clearUser: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },
}));

export default useUserStore;
