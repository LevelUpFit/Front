/**
 * AI 분석 완료 시 사용자에게 표시되는 알림 모달
 */
export default function AnalysisCompleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* 배경 흐림 처리 (Backdrop) */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* 모달 컨텐츠: 다크 글래스모피즘 스타일 */}
            <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center border border-purple-400/30 transform transition-all scale-100 animate-bounce-slight text-white">
                
                {/* 상단 아이콘 */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-600/30 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* 텍스트 내용 */}
                <h3 className="text-2xl font-bold text-white mb-2">
                    분석 완료!
                </h3>
                <p className="text-sm text-gray-300 mb-8">
                    AI 코치가 피드백을 준비했습니다.<br />
                    지금 바로 자세 분석 결과를 확인하세요!
                </p>

                {/* 버튼 영역 */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 border border-transparent rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] text-lg"
                    >
                        결과 확인하기
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold text-gray-300 hover:bg-white/20 transition-colors"
                    >
                        나중에 확인 (목록으로 돌아가기)
                    </button>
                </div>
            </div>

            {/* 등장 애니메이션 스타일 */}
            <style>{`
                @keyframes bounce-slight {
                    0% { opacity: 0; transform: scale(0.9); }
                    70% { transform: scale(1.02); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-bounce-slight {
                    animation: bounce-slight 0.3s cubic-bezier(0.21, 1.02, 0.7, 1) forwards;
                }
            `}</style>
        </div>
    );
}
