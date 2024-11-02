import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../src/components/Header";
import { useStateContext } from "../src/context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import TeacherSidebar from "../src/components/teacher/TeacherSidebar";
import TeacherHeader from "../src/components/teacher/TeacherHeader";

export default function TeacherLayout() {
    const { user, teacherToken, notification, setUser, setToken } =
        useStateContext();

    if (!teacherToken) {
        return <Navigate to="/teacher/login" />;
    }
    return (
        <div className="d-flex">
            <TeacherSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <TeacherHeader />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
