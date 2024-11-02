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

export default function FinanceSidebar() {
    const links = [
        {
            to: "/finance/dashboard",
            icon: "/img/dashboard.png",
            label: "Dashboard",
        },

        {
            to: "/finance/pendingstudents",
            icon: "/img/pending_student.png",
            label: "Pending Students",
        },
        // {
        //     to: "/finance/confirmedstudents",
        //     icon: "/img/class_list.png",
        //     label: "Confirm Students",
        // },
        {
            to: "/finance/students",
            icon: "/img/student_list.png",
            label: "Students",
        },
        {
            to: "/finance/announcements",
            icon: "/img/announcement.png",
            label: "Announcement",
        },
        {
            to: "/finance/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Finance</h2>
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
