import React, { useEffect, useState } from "react";
import DashboardBox from "../components/DashboardBox";
import axiosClientAdmin from "../axoisclient/axios-client-admin";

export default function AdminHome() {
    const [employeeCount, setEmployeeCount] = useState(null);
    const [studentCount, setStudentCount] = useState(null);
    const [announcementCount, setAnnouncementCount] = useState(0);

    const getCount = () => {
        axiosClientAdmin.get("/count-employee").then((data) => {
            setEmployeeCount(data.data.count);
        });

        axiosClientAdmin.get("/count-students").then((data) => {
            setStudentCount(data.data.count);
        });

        axiosClientAdmin.get("/count/admin/announcements").then(({ data }) => {
            setAnnouncementCount(data);
        });
    };

    useEffect(() => {
        getCount();
    }, []);

    return (
        <div
            className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
            style={{
                padding: 20,
            }}
        >
            <DashboardBox
                BoxColor="#E1604E"
                title="Total Employee"
                count={employeeCount}
            />
            <DashboardBox
                BoxColor="#6987EA"
                title="Total Students"
                count={studentCount}
            />
            <DashboardBox
                BoxColor="#E1DB4E"
                title="Total Announcement"
                count={announcementCount}
            />
            {/* <DashboardBox BoxColor="#761212" title="Total Finance" /> */}
        </div>
    );
}
