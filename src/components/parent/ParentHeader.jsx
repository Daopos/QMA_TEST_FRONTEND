import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import axiosClientFinance from "../../axoisclient/axios-client-finance";

export default function pARENThEADER() {
    const { setUser, setFinanceToken } = useStateContext();
    const [profile, setProfile] = useState();

    // useEffect(() => {
    //     const intervalId = setInterval(getProfile, 5000); // Fetch every 5 seconds

    //     return () => clearInterval(intervalId); // Cleanup on unmount
    // }, []);

    const getProfile = () => {
        axiosClientFinance
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

        axiosClientFinance.post("/logout").then(() => {
            setUser({});
            setFinanceToken(null);
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
