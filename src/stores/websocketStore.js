import { create } from 'zustand';

export const useWebSocketStore = create((set, get) => ({
  socket: null,

  connect: (feedbackId, onComplete, onShowModal) => {
    const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;
    const url = `${wsBaseUrl}/feedback/${feedbackId}`;
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("✅ WebSocket 연결 성공:", url);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 WebSocket 메시지 수신:", data);

      if (data.type === "FEEDBACK_ANALYSIS_COMPLETE") {
        const receivedFeedbackId = data.feedbackId || feedbackId;
        socket.close(); // 연결 종료
        
        // 콜백 함수 실행 (피드백 리스트 갱신)
        if (onComplete) {
          onComplete();
        }
        
        // 모달 열기 (feedbackId 전달)
        if (onShowModal) {
          onShowModal(receivedFeedbackId);
        }
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket 에러:", error);
      alert("WebSocket 연결에 실패했습니다.");
    };

    socket.onclose = (event) => {
      console.log("❌ WebSocket 닫힘 (code:", event.code, ", reason:", event.reason, ")");
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
