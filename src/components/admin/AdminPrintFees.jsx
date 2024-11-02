import React from "react";
import Table from "react-bootstrap/Table";

const AdminPrintFees = React.forwardRef(({ fees }, ref) => (
    <div ref={ref} style={{ padding: "30px" }}>
        <h2>Fee Breakdown</h2>
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {fees.map((fee, index) => (
                    <tr key={index}>
                        <td>{fee.title}</td>
                        <td>{fee.amount}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
));

export default AdminPrintFees;
