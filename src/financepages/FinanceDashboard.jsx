import React from "react";
import DashboardBox from "../components/DashboardBox";

export default function FinanceDashboard() {
    return (
        <div style={{ padding: "40px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{
                    padding: 20,
                }}
            >
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Students Pre-Enrolled"
                />
                <DashboardBox
                    BoxColor="#1C77"
                    title="Students Ready for Approval"
                />
                <DashboardBox BoxColor="#6987EA" title="Students Enrolled" />
            </div>
        </div>
    );
}
