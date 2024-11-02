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

export default function PrincipalSidebar() {
    const links = [
        {
            to: "/principal/dashboard",
            icon: "/img/dashboard.png",
            label: "Dashboard",
        },

        {
            to: "/principal/class-list",
            icon: "/img/class_list.png",
            label: "Classroom List",
        },
        // {
        //     to: "/principal/subject-list",
        //     icon: "/img/class_list_fee.png",
        //     label: "Subject List",
        // },
        // {
        //     to: "/principal/teacher-list",
        //     icon: "/img/class_list_fee.png",
        //     label: "Teacher List",
        // },
        {
            to: "/principal/announcements",
            icon: "/img/class_list_fee.png",
            label: "Announcement",
        },
        {
            to: "/principal/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Principal</h2>
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
