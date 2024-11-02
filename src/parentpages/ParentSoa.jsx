import React from "react";
import parentGradeCSS from "./ParentGrades.module.css";
import { useQuery } from "react-query";
import axiosClientParent from "../axoisclient/axios-client-parent";
import Spinner from "react-bootstrap/Spinner";

export default function ParentSoa() {
    const {
        data: paymentHistory = [],
        isLoading,
        error,
    } = useQuery(["parentSoa"], async () => {
        const response = await axiosClientParent.get("/parent/soa");

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
        <div>
            <div className={parentGradeCSS.parentGradeContainer}>
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
                                            <td data-label="Date">
                                                {new Intl.DateTimeFormat(
                                                    "en-US",
                                                    {
                                                        month: "long",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }
                                                ).format(
                                                    new Date(payment.created_at)
                                                )}
                                            </td>

                                            <td data-label="Description">
                                                {payment.desc}
                                            </td>
                                            <td data-label="Amount">
                                                {payment.amount}
                                            </td>
                                            <td data-label="Encoder">
                                                {payment.encoder}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
