import React, { useEffect, useMemo } from "react";
import DashboardBox from "../components/DashboardBox";
import Timetable from "../components/TimeTable";
import { useQuery } from "react-query";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import randomColor from "randomcolor"; // Import the randomcolor package

export default function TeacherDashboard() {
    const {
        data: subjectsCounts,
        isLoading: isCountLoading,
        error: isCountError,
    } = useQuery("teacherSUbjectsCounts", async () => {
        const response = await axiosClientTeacher.get(
            "/teacher/count/subjects"
        );
        return response.data.subject_count;
    });

    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery("teacherSubjects", async () => {
        const response = await axiosClientTeacher.get("/teacher/subjects");
        return response.data.subjects;
    });

    // Map day names to numbers
    const dayMap = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
    };

    // Memoize the events to keep the colors consistent across re-renders
    const events = useMemo(() => {
        return subjects.map((subject) => ({
            title: subject.title,
            startTime: subject.start,
            endTime: subject.end,
            daysOfWeek: [dayMap[subject.day]],
            color: randomColor({
                luminosity: "dark",
            }),
            extendedProps: {
                classroomTitle: subject.classroom_title,
                gradeLevel: subject.grade_level,
            },
        }));
    }, [subjects]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <div style={{ padding: "40px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{ padding: 20 }}
            >
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Subjects"
                    count={subjectsCounts}
                />
            </div>
            <div>
                <Timetable events={events} />
            </div>
        </div>
    );
}
