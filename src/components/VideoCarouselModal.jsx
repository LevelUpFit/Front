import React, { useState } from "react";

export default function VideoCarouselModal({ videos, initialIndex = 0, onClose }) {
    const [current, setCurrent] = useState(initialIndex);

    if (!videos || videos.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-xl shadow-lg p-4 max-w-lg w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>
                <div className="flex items-center justify-between mb-2">
                    <button
                        className="text-2xl px-2"
                        onClick={() => setCurrent((current - 1 + videos.length) % videos.length)}
                        disabled={videos.length <= 1}
                    >
                        ◀
                    </button>
                    <div className="flex-1 flex justify-center">
                        <video
                            src={videos[current]}
                            controls
                            className="rounded-lg border border-gray-200 shadow w-full max-h-[60vh]"
                        />
                    </div>
                    <button
                        className="text-2xl px-2"
                        onClick={() => setCurrent((current + 1) % videos.length)}
                        disabled={videos.length <= 1}
                    >
                        ▶
                    </button>
                </div>
                <div className="text-center text-sm text-gray-500">
                    {current + 1} / {videos.length}
                </div>
            </div>
        </div>
    );
}