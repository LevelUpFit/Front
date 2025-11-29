import { useState, useEffect } from "react";

/**
 * 영상 업로드 후 분석 전 확인 모달
 * - 세로/가로 선택 제거 (사용자 요청)
 * - 다크 모드 & 보라빛 글래스모피즘 디자인 적용
 */
export default function OrientationConfirmModal({ video, videoUrl, orientation, setOrientation, onConfirm, onClose }) {
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

    // 영상 비율 확인을 위한 메타데이터 로드
    useEffect(() => {
        if (!videoUrl) return;
        const tempVideo = document.createElement("video");
        tempVideo.src = videoUrl;
        tempVideo.onloadedmetadata = () => {
            setVideoSize({
                width: tempVideo.videoWidth,
                height: tempVideo.videoHeight,
            });
        };
    }, [videoUrl]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* 배경 흐림 처리 */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* 모달 컨텐츠: 다크 글래스모피즘 */}
            <div className="relative w-full max-w-sm p-6 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all scale-100 animate-fadeIn">
                <h2 className="text-xl font-bold text-white mb-2">영상 확인</h2>
                <p className="text-sm text-gray-400 mb-6">
                    선택한 영상으로 분석을 시작하시겠습니까?
                </p>

                {video ? (
                    <div 
                        className="relative w-full bg-black/50 rounded-xl overflow-hidden shadow-inner mb-6 flex items-center justify-center border border-white/5"
                        style={{
                            // 화면 높이의 50%를 넘지 않도록 제한
                            maxHeight: "50vh", 
                            // 영상 비율에 맞춰 컨테이너 크기 조절 (기본 16:9)
                            aspectRatio: videoSize.width && videoSize.height ? `${videoSize.width} / ${videoSize.height}` : "16/9"
                        }}
                    >
                        <video
                            src={videoUrl}
                            controls
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-white/5 rounded-xl mb-6 text-gray-500 border border-white/10 border-dashed">
                        영상을 불러올 수 없습니다.
                    </div>
                )}

                <div className="flex gap-3 w-full">
                    <button
                        className="flex-1 py-3.5 rounded-xl font-bold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors border border-white/5"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    {/* onConfirm에 기존 orientation 값을 전달 (기존 로직 호환성 유지) */}
                    <button
                        className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-transform transform hover:scale-[1.02]"
                        onClick={() => video && onConfirm(orientation)}
                        disabled={!video}
                    >
                        분석 시작
                    </button>
                </div>
            </div>

            {/* 등장 애니메이션 */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}