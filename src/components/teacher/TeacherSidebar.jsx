import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({ to, icon, label }) => {
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
        </Link>
    );
};

export default function TeacherSidebar() {
    const links = [
        {
            to: "/teacher/dashboard",
            icon: "/img/dashboard.png",
            label: "Dashboard",
        },

        {
            to: "/teacher/subjects",
            icon: "/img/subject_list.png",
            label: "Subject List",
        },
        {
            to: "/teacher/advisory-list",
            icon: "/img/student_list.png",
            label: "Advisory",
        },
        {
            to: "/teacher/announcements",
            icon: "/img/announcement.png",
            label: "Announcement",
        },
        {
            to: "/teacher/subjects/archived",
            icon: "/img/subject_list.png",
            label: "Subject List Archived",
        },
        {
            to: "/teacher/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Teacher</h2>
            </div>
            {links.map((link, index) => (
                <SidebarLink
                    key={index}
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                />
            ))}
        </div>
    );
}
