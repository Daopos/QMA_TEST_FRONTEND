import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../src/components/Header";
import FinanceDashboard from "../src/financepages/FinanceDashboard";
import FinanceSidebar from "../src/components/finance/FinanceSidebar";
import { useStateContext } from "../src/context/ContextProvider";
import FInanceHeader from "../src/components/finance/FInanceHeader";

export default function FinaanceLayout() {
    const { user, financeToken, notification, setUser, setToken } =
        useStateContext();

    if (!financeToken) {
        return <Navigate to="/finance/login" />;
    }

    return (
        <div className="d-flex">
            <FinanceSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <FInanceHeader />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
