import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="absolute top-5 left-5 text-2xl font-bold text-gray-600 hover:text-black"
        >
            ←
        </button>
    );
}
