const STATUS_LABELS = {
    pending: "분석중",
    done: "완료",
    fail: "실패",
};

export default function FeedbackListCard({ feedback }) {
    const {
        exercise,
        date,
        status,
        accuracy,
        movementRange,
        movementSpeed,
    } = feedback;

    const accuracyText = typeof accuracy === "number" ? `${accuracy.toFixed(1)}%` : "-";
    const rangeText = typeof movementRange === "number" ? `${movementRange.toFixed(1)}%` : "-";
    const contraction = movementSpeed?.contractionPercent;
    const relaxation = movementSpeed?.relaxationPercent;

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-lg backdrop-blur-lg transition hover:bg-white/15">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm text-purple-200">{date}</p>
                    <h3 className="mt-1 truncate text-lg font-semibold">{exercise}</h3>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        status === "done"
                            ? "bg-green-500/20 text-green-200"
                            : status === "pending"
                            ? "bg-yellow-500/20 text-yellow-200"
                            : "bg-rose-500/20 text-rose-200"
                    }`}
                >
                    {STATUS_LABELS[status] || "상태 미확인"}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-3">
                    <p className="text-gray-300">정확도</p>
                    <p className="mt-1 text-base font-semibold text-purple-200">{accuracyText}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-3">
                    <p className="text-gray-300">가동범위</p>
                    <p className="mt-1 text-base font-semibold text-purple-200">{rangeText}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-3">
                    <p className="text-gray-300">리듬</p>
                    {status === "done" && contraction != null && relaxation != null ? (
                        <p className="mt-1 text-[13px] font-semibold text-purple-200">
                            수축 {contraction}%
                            <br />이완 {relaxation}%
                        </p>
                    ) : (
                        <p className="mt-1 text-base font-semibold text-purple-200">-</p>
                    )}
                </div>
            </div>
        </div>
    );
}