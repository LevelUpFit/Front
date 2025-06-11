import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    workoutsByDate: {},

    // // 유저 설정
    // setUser: ({ email, nickname, kakaoId, profile, level }) => {
    //     const userInfo = { email, nickname, kakaoId, profile, level };
    //     localStorage.setItem("user", JSON.stringify(userInfo));
    //     set({ user: userInfo });
    //     },

    // setUser로 통합: 토큰 및 유저 정보 모두 저장
    setUser: (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData });
        },


    // 유저 정보 가져오기
    getUserId: () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? user.userId : null;
    },
    
    // 유저 로그아웃
    clearUser: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },

    // 운동 기록 저장
    setWorkoutByDate: (date, workoutData) =>
        set((state) => ({
            workoutsByDate: {
                ...state.workoutsByDate,
                [date]: workoutData,
            },
        })),

    // 운동 기록 삭제
    removeWorkoutByDate: (date) =>
        set((state) => {
            const updated = { ...state.workoutsByDate };
            delete updated[date];
            return { workoutsByDate: updated };
        }),
}));

export default useUserStore;
