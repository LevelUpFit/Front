import CalendarLib from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Calendar({ selectedDate, onSelect, workoutDates }) {
    const today = new Date();
    const tileClassName = ({ date, view }) => {
        const dateStr = date.toISOString().split("T")[0];
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
            locale="en"
        />
    );
}
