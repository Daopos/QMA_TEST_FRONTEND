import React, { useMemo } from "react";
import DashboardBox from "../components/DashboardBox";
import { useQuery } from "react-query";
import axiosClientParent from "../axoisclient/axios-client-parent";
import randomColor from "randomcolor";
import TimetableStudent from "../components/TimeTableStudent";
import Spinner from "react-bootstrap/Spinner";

export default function ParentDashboard() {
    const {
        data: subjectsCounts,
        isLoading: isCountLoading,
        error: isCountError,
    } = useQuery("studentSubjectsCount", async () => {
        const response = await axiosClientParent.get(
            "/student/subejcts/coount"
        );
        return response.data.subject_count;
    });

    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery("parentSubjects", async () => {
        const response = await axiosClientParent.get("/parent/subjects");
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
                teacher: `${subject.teacher_fname} ${subject.teacher_lname}`,
            },
        }));
    }, [subjects]);

    if (isLoading)
        return (
            <div className="d-flex justify-content-center pt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    if (error) return <div>Error loading data</div>;
    return (
        <div style={{ padding: "10px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{
                    padding: 20,
                }}
            >
                <DashboardBox BoxColor="#E1604E" title="Payment Balance" />
                <DashboardBox BoxColor="#1C77" title="Announcement" />
                {/* <DashboardBox BoxColor="#761212" title="Total Finance" /> */}
            </div>
            <div>
                <TimetableStudent events={events} />
            </div>
        </div>
    );
}
