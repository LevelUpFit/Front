import { useRef, useEffect } from "react";

export default function CustomSelect({ options, value, onChange, borderColor = "#3b82f6", open, setOpen, name }) {
    const isActive = open === name;
    const selectRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;
        const handleClick = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isActive, setOpen]);

    return (
        <div className="relative w-36 select-none" ref={selectRef}>
            <button
                type="button"
                className="w-full bg-white rounded-xl border-2 py-1.5 px-3 text-base font-semibold flex items-center justify-between"
                style={{
                    borderColor: isActive ? borderColor : "#e5e7eb",
                    boxShadow: isActive ? `0 0 0 2px #3b82f655` : "0 2px 8px 0 #3b82f622",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    minHeight: 38,
                }}
                onClick={() => setOpen(isActive ? null : name)}
                tabIndex={0}
            >
                <span className="truncate">{value}</span>
                <span className="ml-2 text-base text-gray-500">▴</span>
            </button>
            {isActive && (
                <div
                    className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-lg z-20 border"
                    style={{ boxShadow: "0 4px 16px 0 #3b82f633" }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-4 py-2 cursor-pointer text-base ${
                                value === opt
                                    ? "bg-blue-100 text-blue-700 font-bold"
                                    : "hover:bg-blue-50"
                            }`}
                            onClick={() => {
                                onChange(opt);
                                setOpen(null);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}