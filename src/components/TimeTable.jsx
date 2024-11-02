import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Import Tooltip and OverlayTrigger from React Bootstrap
import "./TimeTable.css";

const Timetable = ({ events }) => {
    const renderCustomHeader = ({ date }) => {
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const dayIndex = date.getDay();

        // Only show weekday names (hide weekends if needed)
        if (dayIndex >= 1 && dayIndex <= 5) {
            return <div className="weekdayHeader">{weekdays[dayIndex]}</div>;
        }
        return null; // Hide weekend headers
    };

    return (
        <div className="timetableContainer">
            <FullCalendar
                plugins={[timeGridPlugin]}
                headerToolbar={false}
                initialView="timeGridWeek"
                weekends={false}
                allDaySlot={false}
                slotMinTime="07:00:00"
                slotMaxTime="18:00:00"
                events={events} // Pass events here
                nowIndicator={true}
                dayHeaderContent={renderCustomHeader}
                eventContent={(eventInfo) => {
                    const startTime = eventInfo.event.start.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    );
                    const endTime = eventInfo.event.end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    const tooltip = (
                        <Tooltip id={`tooltip-${eventInfo.event.id}`}>
                            <strong>Title:</strong> {eventInfo.event.title}
                            <br />
                            <strong>Classroom:</strong>{" "}
                            {eventInfo.event.extendedProps.classroomTitle ||
                                "N/A"}
                            <br />
                            <strong>Grade Level:</strong>{" "}
                            {eventInfo.event.extendedProps.gradeLevel || "N/A"}
                            <br />
                            <strong>Start:</strong> {startTime}
                            <br />
                            <strong>End:</strong> {endTime}
                        </Tooltip>
                    );

                    return (
                        <OverlayTrigger placement="top" overlay={tooltip}>
                            <div
                                style={{
                                    backgroundColor:
                                        eventInfo.event.backgroundColor,
                                    padding: "5px",
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "4px",
                                }}
                            >
                                <strong>{eventInfo.event.title}</strong>
                                <br />
                                <span>
                                    {startTime} - {endTime}
                                </span>{" "}
                                {/* Display start and end times */}
                            </div>
                        </OverlayTrigger>
                    );
                }}
            />
        </div>
    );
};

export default Timetable;
