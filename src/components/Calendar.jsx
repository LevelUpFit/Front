import React from "react";
import CalendarLib from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // 추가 커스텀 스타일이 필요할 경우

export default function Calendar({ selectedDate, onSelect, workoutDates }) {
    return (
        <CalendarLib
            onChange={onSelect}
            value={selectedDate}
            tileClassName={({ date }) => {
                const dateStr = date.toISOString().split("T")[0];
                return workoutDates.includes(dateStr) ? "highlight" : null;
            }}
        />
    );
}