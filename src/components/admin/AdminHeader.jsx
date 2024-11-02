import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClientAdmin from "../../axoisclient/axios-client-admin";
import studentheaderCSS from "../student/studentheadersidebar.module.css";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export default function AdminHeader() {
    const { user, token, notification, setUser, setAdminToken } =
        useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClientAdmin.post("/logout").then(() => {
            setUser({});
            setAdminToken(null);
        });
    };
    const [openNav, setOpenNav] = useState(false);

    const handleOpenNav = () => {
        setOpenNav(!openNav);
    };

    const handleCloseNav = () => {
        setOpenNav(false);
    };

    return (
        <>
            <div
                id="mySidenav"
                className={`${studentheaderCSS.sidenav} ${
                    openNav ? studentheaderCSS.sidenavOpen : ""
                }`}
            >
                <a
                    className={studentheaderCSS.closebtn}
                    onClick={handleCloseNav}
                >
                    &times;
                </a>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/home"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Dashbaord</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/gradelistfee"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Grade List Fee</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/academicyear"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Academic Year</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/studentlist"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Student List</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/employee"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Employee</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/announcement"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Announcement</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/employeearchive"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Employee Archive</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/audit"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Audit Trail</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/admin/profile"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Profile</span>
                </Link>
            </div>
            <div className="header-container">
                <div className="d-flex align-items-center gap-2">
                    <div className={studentheaderCSS.burgerMenu}>
                        <MenuIcon onClick={handleOpenNav} />
                    </div>
                    <img src="/img/profile.png" alt="" width={50} />
                    <h5>Admin</h5>
                </div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </>
    );
}
