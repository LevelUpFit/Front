import CalendarLib from "react-calendar";
import "react-calendar/dist/Calendar.css";

// 한국 시간 기준 YYYY-MM-DD 반환 함수
function getKoreaDateKey(date) {
    const korea = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return korea.toISOString().split("T")[0];
}

export default function Calendar({ selectedDate, onSelect, workoutDates, onActiveStartDateChange }) {
    const today = new Date();
    const tileClassName = ({ date, view }) => {
        const dateStr = getKoreaDateKey(date); // 한국 시간 기준으로 변환
        if (view === "month" && workoutDates.includes(dateStr)) {
            return "bg-blue-200 text-blue-800 font-bold rounded-full";
        }
        return null;
    };

    const tileDisabled = ({ date }) => date > today;

    // 일요일 빨간색, 토요일 파란색, 나머지는 검정색
    const formatDay = (_, date) => {
        const day = date.getDay();
        let color = "text-black";
        if (day === 0) color = "text-red-500";      // 일요일
        else if (day === 6) color = "text-blue-500"; // 토요일
        return <span className={color}>{date.getDate()}</span>;
    };

    return (
        <CalendarLib
            onChange={onSelect}
            value={selectedDate}
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
            locale="ko-KR"
            showNeighboringMonth={false}
            calendarType="hebrew"
            formatDay={formatDay}
            onActiveStartDateChange={onActiveStartDateChange} // 추가!
        />
    );
}
