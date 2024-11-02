import React, { useEffect, useState } from "react";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import { useStateContext } from "../../context/ContextProvider";

export default function PrincipalHeader() {
    const { user, token, notification, setUser, setPrincipalToken } =
        useStateContext();

    const [profile, setProfile] = useState();

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = () => {
        axiosClientPrincipal
            .get("/employee/profile")
            .then(({ data }) => {
                setProfile(data.employee);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClientPrincipal.post("/logout").then(() => {
            setPrincipalToken(null);
        });
    };

    return (
        <div className="header-container">
            <div className="d-flex align-items-center gap-2">
                <img
                    src={profile?.image_url || "/img/profile.png"}
                    alt="Profile"
                    style={{
                        width: "50px", // Set your desired width
                        height: "50px", // Set the same value as width for a circle
                        borderRadius: "50%",
                        objectFit: "cover", // Ensures the image covers the entire circle
                    }}
                />
                <h5>{profile?.fname || ""}</h5>
            </div>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}
