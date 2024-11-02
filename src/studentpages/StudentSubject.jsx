import React, { useEffect, useState } from "react";

import axiosClientStudent from "../axoisclient/axios-client-student";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import randomColor from "randomcolor"; // Import the randomcolor package

import Spinner from "react-bootstrap/Spinner";

export default function StudentSubject() {
    const [subjectColors, setSubjectColors] = useState([]); // State to hold colors

    const {
        data: subjects = [],
        isLoading,
        error,
    } = useQuery(["studentSubject"], async () => {
        const response = await axiosClientStudent.get("/student/subjects");
        console.log(response.data.subjects);
        return response.data.subjects;
    });

    useEffect(() => {
        // Generate random colors only when subjects are fetched
        if (subjects.length > 0) {
            const colors = subjects.map(() =>
                randomColor({
                    luminosity: "dark",
                })
            );
            setSubjectColors(colors);
        }
    }, [subjects]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        ); // You can replace this with a spinner or loading component
    }

    if (error) {
        return <div>Error fetching: {error.message}</div>;
    }
    return (
        <div style={{ padding: "40px 30px" }}>
            <div className="d-flex gap-5 flex-wrap">
                {subjects.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            width: "300px",
                            margin: "auto",
                            height: "200px",
                            backgroundColor: "#f9f9f9",
                            color: "#555",
                            textAlign: "center",
                            padding: "20px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h5 style={{ marginBottom: "10px" }}>
                            No Subject Schedules yet
                        </h5>
                        <p style={{ fontSize: "14px", color: "#888" }}>
                            Please check back later for available schedules.
                        </p>
                    </div>
                ) : (
                    subjects.map((data, index) => (
                        <Link
                            style={{ textDecoration: "none" }} // Remove underline from the link
                            to={`/student/subjects/${data.id}/all`} // Navigate to SubjectDetail with subjectId
                        >
                            <div
                                style={{
                                    border: "1px solid black",
                                    borderRadius: "10px",
                                    width: "300px",
                                    height: "200px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center", // Center horizontally
                                        alignItems: "center", // Center vertically
                                        flexDirection: "column",
                                        height: "60%",
                                        gap: "4px",
                                    }}
                                >
                                    <h6>{`${data.teacher_fname} ${data.teacher_lname}`}</h6>
                                    <a>{`Time: ${data.start} - ${data.end}`}</a>
                                </div>

                                <div
                                    style={{
                                        backgroundColor: subjectColors[index],
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "40%",
                                        borderRadius: "0 0 10px 10px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {data.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
