import React, { useRef, useState } from "react";
import "../assets/css/access.css";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";

import { useStateContext } from "../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Spinner } from "react-bootstrap"; // Import React Bootstrap components

export default function RegistrarLogin() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    const { user, registrarToken } = useStateContext();

    if (registrarToken) {
        return <Navigate to="/registrar/dashboard" />;
    }

    const { setUser, setRegistrarToken } = useStateContext();
    const [loading, setLoading] = useState(false); // Loading state
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true); // Set loading to true when request starts
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);

        axiosClientRegistrar
            .post("/employee/registrar/login", payload)
            .then(({ data }) => {
                console.log(data.token);
                setUser(data.user);
                console.log(data.message);
                setRegistrarToken(data.token);
                console.log(data.user.type);
                navigate("/registrar/dashboard");
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
                    <h2>Registrar page</h2>
                </div>
                <div>
                    <img
                        src="/img/logo.png"
                        alt=""
                        width={100}
                        className="mob-logo"
                    />
                    <h2 className="mob-h">Registrar Page</h2>
                    <div className="mob-line"></div>
                    <form onSubmit={onSubmit}>
                        <h1>Log in</h1>
                        <div>
                            <label style={errors && { color: "#761212" }}>
                                {errors ? "Email Invalid." : "Email"}
                            </label>
                            <input
                                ref={emailRef}
                                type="text"
                                placeholder="Enter your email"
                                disabled={loading} // Disable input when loading
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
                                disabled={loading}
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
            <ToastContainer limit={1} />
        </div>
    );
}
