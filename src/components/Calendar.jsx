import CalendarLib from "react-calendar";
import "react-calendar/dist/Calendar.css";

// 한국 시간 기준 YYYY-MM-DD 반환 함수
function getKoreaDateKey(date) {
    const korea = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return korea.toISOString().split("T")[0];
}

export default function Calendar({ selectedDate, onSelect, workoutDates }) {
    const today = new Date();
    const tileClassName = ({ date, view }) => {
        const dateStr = getKoreaDateKey(date); // 한국 시간 기준으로 변환
        if (view === "month" && workoutDates.includes(dateStr)) {
            return "bg-blue-200 text-blue-800 font-bold rounded-full";
        }
        return null;
    };

    const tileDisabled = ({ date }) => date > today;

    return (
        <CalendarLib
            onChange={onSelect}
            value={selectedDate}
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
            locale="ko-KR"
            showNeighboringMonth={false}
            calendarType="hebrew" //주의 시작 일요일로 설정
        />
    );
}
