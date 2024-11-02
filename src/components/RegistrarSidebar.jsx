import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";

const SidebarLink = ({ to, icon, label, count }) => {
    const { pathname } = useLocation();
    const isActive = pathname === to;
    const activeStyles = { backgroundColor: "white", color: "black" };

    return (
        <Link
            className="sidebar-item d-flex align-items-center gap-2"
            to={to}
            style={isActive ? activeStyles : {}}
        >
            <img src={icon} alt="" width={30} />
            <span>{label}</span>
            {count !== undefined && (
                <span className="badge bg-danger ms-auto">{count}</span> // Red badge
            )}
        </Link>
    );
};

export default function RegistrarSidebar() {
    const [preEnrolledCount, setPreEnrolledCount] = useState(0);
    const [readyEnrollCount, setReadyEnrollCount] = useState(0);

    // Fetch counts when the component mounts
    useEffect(() => {
        const getCount = () => {
            axiosClientRegistrar
                .get("/count/pre-enrolled/students")
                .then(({ data }) => {
                    setPreEnrolledCount(data);
                })
                .catch((error) => {
                    console.error("Error fetching pre-enrolled count:", error);
                });

            axiosClientRegistrar
                .get("/count/confirmed/students")
                .then(({ data }) => {
                    setReadyEnrollCount(data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching ready enrollment count:",
                        error
                    );
                });
        };

        getCount();
    }, []);

    const links = [
        {
            to: "/registrar/dashboard",
            icon: "/img/dashboard.png",
            label: "Dashboard",
        },
        {
            to: "/registrar/addnew",
            icon: "/img/enroll_new_student.png",
            label: "Enroll New Student",
        },
        {
            to: "/registrar/addold",
            icon: "/img/enroll_new_student.png",
            label: "Enroll Old Student",
        },
        {
            to: "/registrar/pre-enrolled",
            icon: "/img/pre_enrolled_student.png",
            label: "Pre-Enrolled Student",
            count: preEnrolledCount, // Pass fetched count
        },
        {
            to: "/registrar/ready-for-enrollment",
            icon: "/img/ready_for_enrollment.png",
            label: "Ready for Enrollment",
            count: readyEnrollCount, // Pass fetched count
        },
        {
            to: "/registrar/enrolled",
            icon: "/img/enrolled.png",
            label: "Enrolled",
        },
        {
            to: "/registrar/announcements",
            icon: "/img/announcement.png",
            label: "Announcement",
        },
        {
            to: "/registrar/archives",
            icon: "/img/class_list.png",
            label: "Archives",
        },
        {
            to: "/registrar/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Registrar</h2>
            </div>
            {links.map((link, index) => (
                <SidebarLink
                    key={index}
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                    count={link.count} // Pass count to SidebarLink
                />
            ))}
        </div>
    );
}
