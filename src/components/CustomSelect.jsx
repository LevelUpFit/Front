import { useState, useRef, useEffect } from "react";

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "선택...",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-medium text-white shadow-lg backdrop-blur-lg transition hover:border-purple-300 focus:border-purple-400 focus:outline-none"
            >
                <span className={selectedOption ? "text-white" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`h-5 w-5 transform text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-white/20 bg-gray-800/80 shadow-2xl backdrop-blur-xl">
                    <ul className="max-h-60 overflow-auto">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`cursor-pointer px-4 py-3 text-sm transition ${
                                    value === option.value
                                        ? "bg-purple-600 font-semibold text-white"
                                        : "text-gray-200 hover:bg-purple-500/30"
                                }`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
