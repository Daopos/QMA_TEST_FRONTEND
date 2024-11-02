import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebarHeader.css";
import Accordion from "react-bootstrap/Accordion";
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

export default function AdminSidebar() {
    const links = [
        { to: "/admin/home", icon: "/img/dashboard.png", label: "Dashboard" },
        {
            to: "/admin/profile",
            icon: "/img/profile-list.png",
            label: "Profile",
        },
        {
            to: "/admin/classlist",
            icon: "/img/class_list.png",
            label: "Class List",
        },
        {
            to: "/admin/gradelistfee",
            icon: "/img/class_list_fee.png",
            label: "Grade List Fee",
        },
        {
            to: "/admin/subjectlist",
            icon: "/img/subject_list.png",
            label: "Subject List",
        },

        {
            to: "/admin/academicyear",
            icon: "/img/academic_year.png",
            label: "Academic Year",
        },
        {
            to: "/admin/studentlist",
            icon: "/img/student_list.png",
            label: "Student List",
        },
        {
            to: "/admin/employee",
            icon: "/img/employee_list.png",
            label: "Employee",
        },
        {
            to: "/admin/announcement",
            icon: "/img/announcement.png",
            label: "Announcement",
        },
        {
            to: "/admin/audit",
            icon: "/img/audit.png",
            label: "Audit Trail",
        },
        {
            to: "/admin/employeearchive",
            icon: "/img/audit.png",
            label: "Employee Archive",
        },
        {
            to: "/admin/test",
            icon: "/img/audit.png",
            label: "Student Archive",
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <img src="/img/logo.png" alt="Logo" width={50} />
                <h2>Admin</h2>
            </div>

            {/* {links.map((link, index) => (
                <SidebarLink
                    key={index}
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                />
            ))} */}
            <SidebarLink
                to={links[0].to}
                icon={links[0].icon}
                label={links[0].label}
            />

            {/* <Accordion className="accordion-flush accordion-test">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Class List</Accordion.Header>
                    <Accordion.Body>
                        <SidebarLink
                            to={links[2].to}
                            icon={links[2].icon}
                            label={links[2].label}
                        />
                        <SidebarLink
                            to={links[4].to}
                            icon={links[4].icon}
                            label={links[4].label}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion> */}

            <SidebarLink
                to={links[3].to}
                icon={links[3].icon}
                label={links[3].label}
            />

            <SidebarLink
                to={links[5].to}
                icon={links[5].icon}
                label={links[5].label}
            />
            <SidebarLink
                to={links[6].to}
                icon={links[6].icon}
                label={links[6].label}
            />
            <SidebarLink
                to={links[7].to}
                icon={links[7].icon}
                label={links[7].label}
            />
            <SidebarLink
                to={links[8].to}
                icon={links[8].icon}
                label={links[8].label}
            />

            {/* <Accordion className="accordion-flush accordion-test">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Archive</Accordion.Header>
                    <Accordion.Body>
                        <SidebarLink
                            to={links[11].to}
                            icon={links[11].icon}
                            label={links[11].label}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion> */}
            <SidebarLink
                to={links[10].to}
                icon={links[10].icon}
                label={links[10].label}
            />
            <SidebarLink
                to={links[9].to}
                icon={links[9].icon}
                label={links[9].label}
            />
            <SidebarLink
                to={links[1].to}
                icon={links[1].icon}
                label={links[1].label}
            />
        </div>
    );
}
