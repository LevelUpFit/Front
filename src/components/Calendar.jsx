import CalendarLib from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCustom.css";

// 한국 시간 기준 YYYY-MM-DD 반환 함수
function getKoreaDateKey(date) {
    const korea = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return korea.toISOString().split("T")[0];
}

export default function Calendar({
    selectedDate,
    onSelect,
    workoutDates,
    onActiveStartDateChange,
}) {
    const today = new Date();

    const tileClassName = ({ date, view }) => {
        const dateStr = getKoreaDateKey(date);
        if (view === "month" && workoutDates.includes(dateStr)) {
            return "workout-day";
        }
        return null;
    };

    const tileDisabled = ({ date }) => date > today;

    // 일요일 빨강, 토요일 파랑
    const formatDay = (_, date) => {
        const day = date.getDay();
        let color = "";
        if (day === 0) color = "text-red-400";
        else if (day === 6) color = "text-blue-400";
        return <span className={color}>{date.getDate()}</span>;
    };

    return (
        <div className="calendar-dark-theme">
            <CalendarLib
                onChange={onSelect}
                value={selectedDate}
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                locale="ko-KR"
                /* 🔴 여기! false → true 로 바꾼다 */
                showNeighboringMonth={true}
                /* 이 버전에서 쓸 수 있는 일요일 시작 타입 */
                calendarType="hebrew"
                formatDay={formatDay}
                onActiveStartDateChange={onActiveStartDateChange}
            />
        </div>
    );
}
