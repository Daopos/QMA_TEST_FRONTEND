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
            <span className="sidebar-name">{label}</span>
        </Link>
    );
};

export default function StudentSidebar() {
    const links = [
        {
            to: "/student/dashboard",
            icon: "/img/dashboard.png",
            label: "Dashboard",
        },
        {
            to: "/student/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
        {
            to: "/student/subjects",
            icon: "/img/subject_list.png",
            label: "Subjects",
        },
        {
            to: "/student/soa",
            icon: "/img/soa.png",
            label: "SOA",
        },
        {
            to: "/student/grade",
            icon: "/img/grades.png",
            label: "Grades",
        },
        {
            to: "/student/announcements",
            icon: "/img/announcement.png",
            label: "Announcement",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Student</h2>
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
