import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../src/components/Header";
import RegistrarSidebar from "../src/components/RegistrarSidebar";
import { useStateContext } from "../src/context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrarHeader from "../src/components/registrar/RegistrarHeader";

export default function RegistrarLayout() {
    const { user, registrarToken, notification, setUser, setToken } =
        useStateContext();

    if (!registrarToken) {
        return <Navigate to="/registrar/login" />;
    }
    return (
        <div className="d-flex">
            <RegistrarSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <RegistrarHeader />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
