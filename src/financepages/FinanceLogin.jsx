import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClientFinance from "../axoisclient/axios-client-finance";
import { Button, Spinner } from "react-bootstrap"; // Import React Bootstrap components
import { ToastContainer, toast } from "react-toastify";

export default function FinanceLogin() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    const { user, financeToken } = useStateContext();

    if (financeToken) {
        return <Navigate to="/finance/dashboard" />;
    }

    const { setUser, setFinanceToken } = useStateContext();

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true); // Set loading to true when request starts

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);

        axiosClientFinance
            .post("/employee/finance/login", payload)
            .then(({ data }) => {
                console.log(data.token);
                setUser(data.user);
                console.log(data.message);
                setFinanceToken(data.token);
                console.log(data.user.type);
                navigate("/finance/dashboard");
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
                    <h2>Finance page</h2>
                </div>
                <div>
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
                                    />
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
