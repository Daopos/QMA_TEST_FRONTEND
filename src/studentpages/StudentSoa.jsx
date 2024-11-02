import React from "react";
import axiosClientStudent from "../axoisclient/axios-client-student";
import { useQuery } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import parentGradeCSS from "../parentpages/ParentGrades.module.css";

export default function StudentSoa() {
    const {
        data: paymentHistory = [],
        isLoading,
        error,
    } = useQuery(["studentSoa"], async () => {
        const response = await axiosClientStudent.get("/student/soa");
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
            <div className={parentGradeCSS.parentGradeContainer}>
                <div>
                    <table className={parentGradeCSS.parentTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Encoder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((yearData, index) => (
                                <React.Fragment key={index}>
                                    {/* Row for Academic Year */}
                                    <tr>
                                        <td
                                            colSpan="4"
                                            style={{
                                                textAlign: "center",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Academic Year &nbsp;
                                            {yearData.academic_year}
                                        </td>
                                    </tr>
                                    {/* Rows for Payments */}
                                    {yearData.payments.map(
                                        (payment, paymentIndex) => (
                                            <tr key={paymentIndex}>
                                                <td>
                                                    {new Intl.DateTimeFormat(
                                                        "en-US",
                                                        {
                                                            month: "long",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        }
                                                    ).format(
                                                        new Date(
                                                            payment.created_at
                                                        )
                                                    )}
                                                </td>

                                                <td>{payment.desc}</td>
                                                <td>{payment.amount}</td>
                                                <td>{payment.encoder}</td>
                                            </tr>
                                        )
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
