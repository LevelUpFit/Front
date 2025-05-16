export default function WorkoutSummary({ data }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">운동 요약</h2>
            <p className="text-gray-700">운동 부위: {data.part}</p>
            <ul className="list-disc ml-5 mt-2">
                {data.routine.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    );
}