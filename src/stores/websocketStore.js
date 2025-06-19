import { create } from 'zustand';

export const useWebSocketStore = create((set, get) => ({
  socket: null,

  connect: (url) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("✅ WebSocket 열림");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 메시지:", data);

      if (data.type === "FEEDBACK_ANALYSIS_COMPLETE") {
        alert("분석 완료!");
        socket.close(); // 연결 종료
        window.location.reload(); //분석 종료후 페이지 새로고침
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket 닫힘");
      set({ socket: null });
    };

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
}));
