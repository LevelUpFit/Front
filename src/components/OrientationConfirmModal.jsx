import { useState, useEffect } from "react";

export default function OrientationConfirmModal({ video, videoUrl, orientation, setOrientation, onConfirm, onClose }) {
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs mx-auto text-center">
                <h2 className="text-lg font-bold mb-4">영상 방향을 확인해주세요</h2>
                {video ? (
                    <div
                        className="mx-auto mb-4 bg-black rounded flex items-center justify-center"
                        style={{
                            width: videoSize.width ? `${Math.min(videoSize.width, 320)}px` : "auto",
                            height: videoSize.height
                                ? `${Math.min(videoSize.height, 320)}px`
                                : "auto",
                            maxWidth: "100%",
                            maxHeight: "320px",
                        }}
                    >
                        <video
                            src={videoUrl}
                            controls
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "block",
                                background: "#000",
                                borderRadius: "0.5rem",
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded mb-4 text-gray-400">
                        동영상을 업로드 해야합니다
                    </div>
                )}
                <div className="flex justify-center my-0 mb-4">
                    <div className="relative flex w-[190px] h-10 bg-gray-100 rounded-full shadow-sm mx-auto">
                        <span
                            className="absolute top-0 left-0 h-full w-1/2 transition-all duration-300 rounded-full bg-blue-500 z-0"
                            style={{
                                transform: orientation === "가로"
                                    ? "translateX(100%)"
                                    : "translateX(0%)",
                            }}
                        />
                        <button
                            className={`relative flex-1 z-10 text-base font-semibold transition-colors duration-300
                                ${orientation === "세로" ? "text-white" : "text-gray-700"}
                            `}
                            style={{ borderRadius: "9999px" }}
                            onClick={() => setOrientation("세로")}
                            type="button"
                        >
                            세로영상
                        </button>
                        <button
                            className={`relative flex-1 z-10 text-base font-semibold transition-colors duration-300
                                ${orientation === "가로" ? "text-white" : "text-gray-700"}
                            `}
                            style={{ borderRadius: "9999px" }}
                            onClick={() => setOrientation("가로")}
                            type="button"
                        >
                            가로영상
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex-1 bg-blue-500 text-white py-2 rounded font-bold"
                        onClick={() => video && onConfirm(orientation)}
                        disabled={!video}
                    >
                        확인
                    </button>
                    <button
                        className="flex-1 bg-gray-300 py-2 rounded font-bold"
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}