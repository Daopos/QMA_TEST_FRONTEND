import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import studentheaderCSS from "./studentheadersidebar.module.css";
import { Link } from "react-router-dom";
import axiosClientStudent from "../../axoisclient/axios-client-student";
import { useStateContext } from "../../context/ContextProvider";

export default function StudentHeader() {
    const { setUser, setStudentToken } = useStateContext();

    const [openNav, setOpenNav] = useState(false);

    const [profile, setProfile] = useState();

    useEffect(() => {
        const intervalId = setInterval(getProfile, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const getProfile = () => {
        axiosClientStudent
            .get("/student/profile")
            .then(({ data }) => {
                setProfile(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOpenNav = () => {
        setOpenNav(!openNav);
    };

    const handleCloseNav = () => {
        setOpenNav(false);
    };

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClientStudent.post("/logout").then(() => {
            setUser({});
            setStudentToken(null);
        });
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
                    to="/student/dashboard"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Dashbaord</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/profile"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Profile</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/subjects"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">Subjects</span>
                </Link>
                <Link
                    className="sidebar-item d-flex align-items-center gap-2"
                    to="/student/soa"
                    onClick={handleCloseNav}
                >
                    <img src="/img/dashboard.png" alt="" width={30} />
                    <span className="sidebar-name">SOA</span>
                </Link>
            </div>

            <div className="header-container">
                <div className="d-flex align-items-center gap-2">
                    <div className={studentheaderCSS.burgerMenu}>
                        <MenuIcon onClick={handleOpenNav} />
                    </div>
                    <img
                        src={profile?.image || "/img/profile.png"}
                        alt="Profile"
                        style={{
                            width: "50px", // Set your desired width
                            height: "50px", // Set the same value as width for a circle
                            borderRadius: "50%",
                            objectFit: "cover", // Ensures the image covers the entire circle
                        }}
                    />
                    <h5>{`${profile?.firstname || ""} ${
                        profile?.surname || ""
                    }`}</h5>
                </div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </>
    );
}
