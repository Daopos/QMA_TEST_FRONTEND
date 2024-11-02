import React from "react";
import parentGradeCSS from "./ParentGrades.module.css";
import axiosClientParent from "../axoisclient/axios-client-parent";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";

export default function ParentGrade() {
    const {
        data: grades = [],
        isLoading,
        error,
    } = useQuery(["parentGrade"], async () => {
        const response = await axiosClientParent.get("/parent/grades");
        console.log(response.data);
        return response.data;
    });
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
        <div>
            <div className={parentGradeCSS.parentGradeContainer}>
                {Object.keys(grades).length === 0 ? (
                    <p>No grades available</p>
                ) : (
                    <table className={parentGradeCSS.parentTable}>
                        <thead>
                            <tr>
                                <th scope="col">Subject</th>
                                <th
                                    scope="col"
                                    className={parentGradeCSS.thDif}
                                >
                                    Q1
                                </th>
                                <th scope="col">Q2</th>
                                <th
                                    scope="col"
                                    className={parentGradeCSS.thDif}
                                >
                                    Q3
                                </th>
                                <th scope="col">Q4</th>
                                <th scope="col">Final Grade</th>
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
                                                <td data-label="Subject">
                                                    {subject.subject}
                                                </td>
                                                <td data-label="Q1">
                                                    {subject.first_quarter}
                                                </td>
                                                <td data-label="Q2">
                                                    {subject.second_quarter}
                                                </td>
                                                <td data-label="Q3">
                                                    {subject.third_quarter}
                                                </td>
                                                <td data-label="Q4">
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
    );
}
