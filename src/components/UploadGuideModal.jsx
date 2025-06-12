export default function UploadGuideModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center px-4">
            <div className="bg-white p-5 pb-6 rounded-2xl max-h-[85vh] w-full max-w-md overflow-y-auto relative shadow-lg translate-y-[-5%]">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <div className="space-y-4 text-sm text-gray-800">
                    <div>
                        <h2 className="font-bold text-base mb-1">📸 촬영 방향</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>정면 또는 측면에서 촬영해 주세요.</li>
                            <li>가능하면 정면과 측면 각각 1개씩 업로드하면 분석 정확도가 높아집니다.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-base mb-1">✏️ 촬영 거리 및 구도</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>전신이 프레임 안에 들어오도록 촬영해 주세요 (머리부터 발끝까지).</li>
                            <li>카메라가 흔들리지 않도록 고정된 상태에서 촬영해 주세요.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-base mb-1">🎞️ 영상 시간</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>최대 30초 이내의 짧은 영상만 업로드해 주세요.</li>
                            <li>너무 짧은 영상(3초 미만)은 정확한 분석이 어려울 수 있습니다.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-base mb-1">💡 촬영 환경</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>밝고 균일한 조명 아래에서 촬영해 주세요.</li>
                            <li>배경이 깔끔하고 단순할수록 분석이 잘 됩니다.</li>
                            <li>사람 외 객체가 많거나 어두운 장소는 피해주세요.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-base mb-1">🧥 복장</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>신체 윤곽이 드러나는 운동복 착용을 권장합니다.</li>
                            <li>헐렁한 옷, 치마, 긴 외투는 인식 오류가 발생할 수 있습니다.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-base mb-1">🏃‍♀️ 촬영 중 행동</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>정적인 포즈 또는 하나의 동작 루틴 위주로 촬영해 주세요.</li>
                            <li>너무 많은 움직임이 들어가면 관절 추적이 어려울 수 있습니다.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-base mb-1">💾 파일 형식</h2>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>mp4, mov 등 일반적인 동영상 포맷을 사용해 주세요.</li>
                            <li>파일 크기는 최대 50MB 이내로 권장합니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
