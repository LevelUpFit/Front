import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AnalysisCompleteModal from "../components/AnalysisCompleteModal";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
    const [completedFeedbackId, setCompletedFeedbackId] = useState(null);
    const navigate = useNavigate();
    const socketRef = useRef(null);

    // WebSocket 연결 함수
    const connect = useCallback((feedbackId) => {
        // 이미 연결된 소켓이 있으면 종료
        if (socketRef.current) {
            socketRef.current.close();
        }

        const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;
        const wsUrl = `${wsBaseUrl}/feedback/${feedbackId}`;
        
        console.log("🔌 WebSocket 연결 시도:", wsUrl);
        
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("✅ WebSocket 연결 성공:", wsUrl);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 WebSocket 메시지 수신:", data);

            if (data.type === "FEEDBACK_ANALYSIS_COMPLETE") {
                const receivedFeedbackId = data.feedbackId || feedbackId;
                
                // 분석 완료 모달 표시
                setCompletedFeedbackId(receivedFeedbackId);
                setShowAnalysisComplete(true);

                ws.close();
            }
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket 에러:", error);
        };

        ws.onclose = (event) => {
            console.log("❌ WebSocket 닫힘 (code:", event.code, ", reason:", event.reason, ")");
            setSocket(null);
            socketRef.current = null;
        };

        socketRef.current = ws;
        setSocket(ws);
    }, []);

    // WebSocket 연결 해제 함수
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            setSocket(null);
        }
    }, []);

    // 모달 확인 버튼 클릭
    const handleConfirm = useCallback(() => {
        setShowAnalysisComplete(false);
        if (completedFeedbackId) {
            navigate(`/feedback/${completedFeedbackId}`);
        }
    }, [completedFeedbackId, navigate]);

    // 모달 닫기
    const handleClose = useCallback(() => {
        setShowAnalysisComplete(false);
    }, []);

    // 컴포넌트 언마운트 시 WebSocket 정리
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider 
            value={{ 
                socket, 
                connect, 
                disconnect
            }}
        >
            {children}
            
            {/* 전역 분석 완료 모달 */}
            <AnalysisCompleteModal
                isOpen={showAnalysisComplete}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </WebSocketContext.Provider>
    );
}

// 커스텀 훅
export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within WebSocketProvider");
    }
    return context;
}
