import { useEffect, useState } from "react";
import { getUserLogDetail } from "../api/userlog";

// 초를 MM:SS 형식으로 변환
function formatDuration(seconds) {
    if (!seconds) return null;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
}

export default function WorkoutDetailModal({ logId, logType, onClose, onDelete }) {
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!logId || !logType) return;
            
            setLoading(true);
            setError(null);
            try {
                const res = await getUserLogDetail(logId, logType);
                if (res.data.success) {
                    const data = res.data.data;
                    // exercise_details가 문자열이면 파싱
                    if (data.exercise_details && typeof data.exercise_details === 'string') {
                        try {
                            data.exercise_details = JSON.parse(data.exercise_details);
                        } catch (e) {
                            data.exercise_details = null;
                        }
                    }
                    setLog(data);
                } else {
                    setError("기록을 불러올 수 없습니다.");
                }
            } catch (e) {
                console.error("상세 조회 실패:", e);
                setError("기록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchDetail();
    }, [logId, logType]);

    if (!logId) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 overflow-hidden max-h-[85vh] flex flex-col">
                {loading ? (
                    <div className="p-8 text-center text-gray-300">
                        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                        로딩 중...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <div className="text-red-400 mb-4">{error}</div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
                        >
                            닫기
                        </button>
                    </div>
                ) : log ? (
                    <>
                        {/* 헤더 */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-xl text-white truncate pr-2">{log.name}</h2>
                                <button 
                                    onClick={onClose} 
                                    className="text-2xl text-white/80 hover:text-white transition flex-shrink-0"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                                    {log.log_type === "ROUTINE" ? "루틴 기록" : "운동 기록"}
                                </span>
                            </div>
                        </div>

                        {/* 내용 - 스크롤 가능 */}
                        <div className="p-5 space-y-4 overflow-y-auto flex-1">
                            {/* 날짜 */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg">📅</span>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">날짜</div>
                                    <div className="text-white font-medium">{log.performed_date}</div>
                                </div>
                            </div>

                            {/* 타겟 근육 */}
                            {log.target_muscle && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">💪</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">타겟 근육</div>
                                        <div className="text-white font-medium">{log.target_muscle}</div>
                                    </div>
                                </div>
                            )}

                            {/* 루틴 기록 전용: 총 볼륨, 운동 시간, 세트 수 */}
                            {log.log_type === "ROUTINE" && (
                                <div className="grid grid-cols-3 gap-2">
                                    {log.total_volume != null && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                            <div className="text-lg font-bold text-purple-300">
                                                {log.total_volume.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-gray-400">총 볼륨(kg)</div>
                                        </div>
                                    )}
                                    {log.duration_seconds != null && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                            <div className="text-lg font-bold text-purple-300">
                                                {formatDuration(log.duration_seconds)}
                                            </div>
                                            <div className="text-xs text-gray-400">운동 시간</div>
                                        </div>
                                    )}
                                    {log.total_sets != null && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                            <div className="text-lg font-bold text-purple-300">
                                                {log.total_sets}
                                            </div>
                                            <div className="text-xs text-gray-400">총 세트</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 메모 (운동 기록) */}
                            {log.feedback && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">📝</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs text-gray-400">메모</div>
                                        <div className="text-white font-medium break-words">{log.feedback}</div>
                                    </div>
                                </div>
                            )}

                            {/* 루틴 운동 목록 (ROUTINE 타입인 경우) */}
                            {log.log_type === "ROUTINE" && log.exercise_details && log.exercise_details.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-400 mb-2">운동 목록</div>
                                    <div className="space-y-2">
                                        {log.exercise_details.map((exercise, idx) => {
                                            // 각 운동의 볼륨 계산
                                            const exerciseVolume = exercise.sets?.reduce(
                                                (acc, set) => acc + (set.weight || 0) * (set.reps || 0),
                                                0
                                            ) || 0;
                                            
                                            return (
                                                <div 
                                                    key={idx} 
                                                    className="bg-white/5 border border-white/10 rounded-xl p-3"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-white font-medium">{exercise.name}</div>
                                                        <div className="text-sm text-purple-300">
                                                            {exerciseVolume.toLocaleString()}kg
                                                        </div>
                                                    </div>
                                                    {exercise.sets && exercise.sets.length > 0 && (
                                                        <div className="space-y-1">
                                                            {exercise.sets.map((set, setIdx) => (
                                                                <div 
                                                                    key={setIdx}
                                                                    className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-2 py-1"
                                                                >
                                                                    <span className="text-gray-400">세트 {setIdx + 1}</span>
                                                                    <span className="text-white">
                                                                        {set.weight}kg × {set.reps}회
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 하단 버튼 */}
                        <div className="p-4 border-t border-white/10 flex gap-3 flex-shrink-0">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-white/10 border border-white/20 text-gray-300 rounded-xl py-3 font-bold hover:bg-white/20 transition"
                            >
                                닫기
                            </button>
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(log)}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 font-bold transition"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
