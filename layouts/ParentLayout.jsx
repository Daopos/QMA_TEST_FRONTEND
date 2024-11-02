import React from "react";
import ParentSidebar from "../src/components/parent/ParentSidebar";
import ParentHeader from "../src/components/parent/ParentHeader";
import { useStateContext } from "../src/context/ContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClientParent from "../src/axoisclient/axios-client-parent";
import { useQuery } from "react-query";

export default function ParentLayout() {
    const { user, parentToken, notification, setUser, setToken } =
        useStateContext();

    if (!parentToken) {
        return <Navigate to="/parent/login" />;
    }

    const location = useLocation();

    // Define the routes where you want to show the child card
    const showChildCardRoutes = ["/parent/profile"];

    const {
        data: profile = [],
        isLoading,
        error,
    } = useQuery("parentStudentProfile", async () => {
        const response = await axiosClientParent.get("parent/student/profile");
        return response.data;
    });

    return (
        <div className="d-flex">
            <ParentSidebar />
            <div className="d-flex flex-column " style={{ width: "100%" }}>
                <ParentHeader />
                <main>
                    {!showChildCardRoutes.includes(location.pathname) && (
                        <div className="p-3">
                            <div
                                className="child-card d-flex gap-4"
                                style={{
                                    height: "100px",
                                    width: "fit-content",
                                    boxShadow:
                                        "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#124076",
                                        width: "7px",
                                    }}
                                ></div>
                                <div className="d-flex flex-column gap-2 p-2 align-items-center">
                                    <img
                                        src={"/img/profile.png"}
                                        alt="Profile"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <small>Child</small>
                                </div>
                                <div className="d-flex justify-content-center align-items-center p-3">
                                    <h4>
                                        {`${profile?.surname}${
                                            profile?.extension_name
                                                ? ` ${profile?.extension_name}`
                                                : ""
                                        }, ${profile?.firstname}${
                                            profile?.middlename
                                                ? `, ${profile?.middlename.charAt(
                                                      0
                                                  )}.`
                                                : ""
                                        }`}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
