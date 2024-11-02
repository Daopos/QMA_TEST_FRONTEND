import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import parentGradeCSS from "../parentpages/ParentGrades.module.css";

export default function StudentGrades() {
    const {
        data: grades = [],
        isLoading,
        error,
    } = useQuery(["studentGrade"], async () => {
        const response = await axiosClientStudent.get("/student/grade");
        console.log(response.data);
        return response.data;
    });
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                {" "}
                <Spinner animation="border" variant="primary" />
            </div>
        ); // You can replace this with a spinner or loading component
    }

    if (error) {
        return <div>Error fetching payment history: {error.message}</div>;
    }
    return (
        <>
            <div>
                <div className={parentGradeCSS.parentGradeContainer}>
                    {Object.keys(grades).length === 0 ? (
                        <p>No grades available</p>
                    ) : (
                        <table className={parentGradeCSS.parentTable}>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>Final Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(grades).map(
                                    ([academicYear, subjects]) => (
                                        <React.Fragment key={academicYear}>
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {`Academic Year ${academicYear}`}
                                                </td>
                                            </tr>
                                            {subjects.map((subject, index) => (
                                                <tr key={index}>
                                                    <td>{subject.subject}</td>
                                                    <td>
                                                        {subject.first_quarter}
                                                    </td>
                                                    <td>
                                                        {subject.second_quarter}
                                                    </td>
                                                    <td>
                                                        {subject.third_quarter}
                                                    </td>
                                                    <td>
                                                        {subject.fourth_quarter}
                                                    </td>
                                                    <td>
                                                        {/* Assuming final grade is calculated as an average */}
                                                        {(
                                                            (subject.first_quarter +
                                                                subject.second_quarter +
                                                                subject.third_quarter +
                                                                subject.fourth_quarter) /
                                                            4
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
