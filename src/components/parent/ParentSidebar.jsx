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

export default function ParentSidebar() {
    const links = [
        {
            to: "/parent/dashboard",
            icon: "/img/dashboard.png",
            label: "Dashboard",
        },
        {
            to: "/parent/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
        {
            to: "/parent/grades",
            icon: "/img/class_list.png",
            label: "Grades",
        },
        {
            to: "/parent/schedules",
            icon: "/img/class_list.png",
            label: "Subjects",
        },
        {
            to: "/parent/soa",
            icon: "/img/class_list.png",
            label: "SOA",
        },

        // {
        //     to: "/student/announcements",
        //     icon: "/img/class_list_fee.png",
        //     label: "Announcement",
        // },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Parent</h2>
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
