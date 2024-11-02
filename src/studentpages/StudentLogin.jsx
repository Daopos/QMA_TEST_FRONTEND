import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { Button, Spinner } from "react-bootstrap"; // Import React Bootstrap components
import { ToastContainer, toast } from "react-toastify";

export default function StudentLogin() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    const { user, studentToken } = useStateContext();

    const { setUser, setStudentToken } = useStateContext();

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    if (studentToken) {
        return <Navigate to="/student/dashboard" />;
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true); // Set loading to true when request starts

        const payload = {
            lrn: emailRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);

        axiosClientStudent
            .post("/student/login", payload)
            .then(({ data }) => {
                console.log(data.token);
                console.log(data.message);
                setStudentToken(data.token);
            })
            .catch((err) => {
                const response = err.response;

                if (
                    (response && response.status === 401) ||
                    (response && response.status === 422)
                ) {
                    if (response.data.errors) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            general: [response.data.message],
                        });
                    }
                } else {
                    toast.error("Invalid Credentials!");
                }
            })
            .finally(() => {
                setLoading(false); // Set loading to false when request finishes
            });
    };

    return (
        <div
            style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                backgroundImage: "url(/img/accessbg.png)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="access-container">
                <div>
                    <img src="/img/logo.png" alt="" width={200} />
                    <h2>Student page</h2>
                </div>
                <div>
                    <img
                        src="/img/logo.png"
                        alt=""
                        width={100}
                        className="mob-logo"
                    />
                    <h2 className="mob-h">Student Portal</h2>
                    <div className="mob-line"></div>
                    <form onClick={onSubmit}>
                        <h1>Log in</h1>
                        <div>
                            <label style={errors && { color: "#761212" }}>
                                {errors ? "Username Invalid." : "Username"}
                            </label>
                            <input
                                ref={emailRef}
                                type="text"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label style={errors && { color: "#761212" }}>
                                {errors ? "Password Invalid." : "Password"}
                            </label>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />{" "}
                                    Logging in...
                                </>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <img src="/" alt="" />
        </div>
    );
}
