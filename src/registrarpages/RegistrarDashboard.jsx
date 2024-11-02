import React, { useEffect, useState } from "react";
import DashboardBox from "../components/DashboardBox";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import { PieChart, Pie, Tooltip, Cell, Legend, Label } from "recharts";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
} from "recharts"; // Import necessary components for bar chart
import randomColor from "randomcolor"; // Import the randomcolor package

export default function RegistrarDashboard() {
    const [preEnrolledCount, setPreEnrolledCount] = useState(0);
    const [readyEnrollCount, setReadyEnrollCount] = useState(0);
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const [data, setData] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [enrollmentCountsByYear, setEnrollmentCountsByYear] = useState([]); // New state for enrollment counts by academic year

    const getCount = () => {
        axiosClientRegistrar
            .get("/count/pre-enrolled/students")
            .then(({ data }) => {
                setPreEnrolledCount(data);
            });

        axiosClientRegistrar
            .get("/count/confirmed/students")
            .then(({ data }) => {
                setReadyEnrollCount(data);
            });

        axiosClientRegistrar.get("/count-students").then(({ data }) => {
            setEnrolledCount(data.count);
        });
    };

    const getAcademicYears = () => {
        axiosClientRegistrar.get("/academic-years").then(({ data }) => {
            setAcademicYears(data);
            if (data.length > 0) {
                setSelectedAcademicYear(data[0].id); // Set the first academic year as default
                getStudentCounts(data[0].id); // Fetch counts for the first academic year
            }
        });
    };

    const getStudentCounts = (academicYearId) => {
        axiosClientRegistrar
            .get(`/count/students/by-grade/${academicYearId}`)
            .then(({ data }) => {
                const total = data.reduce((acc, item) => acc + item.total, 0);
                setTotalStudents(total);

                const formattedData = data.map((item) => ({
                    label: `Grade ${item.grade_level}`,
                    value: item.total,
                    percentage: total
                        ? ((item.total / total) * 100).toFixed(2) + "%"
                        : "0%",
                }));
                console.log(formattedData);
                setData(formattedData);
            });
    };

    // Fetch the enrollment counts for each active academic year
    const getEnrollmentCountsByYear = () => {
        axiosClientRegistrar
            .get("/enrollment-counts-by-year")
            .then(({ data }) => {
                // Assuming 'data' now contains an array of objects with academic_year and total
                setEnrollmentCountsByYear(data); // Example: [{ academic_year: "2023-2024", total: 150 }, ...]
            });
    };

    const handleAcademicYearChange = (event) => {
        const yearId = event.target.value;
        setSelectedAcademicYear(yearId);
        getStudentCounts(yearId);
    };

    useEffect(() => {
        getCount();
        getAcademicYears();
        getEnrollmentCountsByYear(); // Fetch enrollment counts on component mount
    }, []);

    return (
        <div style={{ padding: "20px 30px" }}>
            <div
                className="d-flex gap-5 flex-wrap justify-content-lg-start justify-content-sm-center justify-content-center"
                style={{ padding: "0px 0px 20px 0px" }}
            >
                <DashboardBox
                    BoxColor="#E1604E"
                    title="Students Pre-Enrolled"
                    count={preEnrolledCount}
                />
                <DashboardBox
                    BoxColor="#1C77"
                    title="Students Ready for Approval"
                    count={readyEnrollCount}
                />
                <DashboardBox
                    BoxColor="#6987EA"
                    title="Students Enrolled"
                    count={enrolledCount}
                />
            </div>
            <div className="mt-2">
                <div className="d-flex gap-5 flex-wrap">
                    <div
                        className="p-2 border-1 border"
                        style={{ backgroundColor: "rgb(247, 247, 249)" }}
                    >
                        {" "}
                        <select
                            value={selectedAcademicYear}
                            onChange={handleAcademicYearChange}
                        >
                            {academicYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    {year.academic_year}
                                </option>
                            ))}
                        </select>
                        <h2>Count of Students by Grade</h2>
                        <div className="mt-2">
                            <h3>Total Students: {totalStudents}</h3>
                        </div>
                        <PieChart width={500} height={400}>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) =>
                                    `${name}: ${percent.toFixed(2)}%`
                                }
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={randomColor({
                                            luminosity: "dark",
                                        })}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    {/* Bar Chart for Enrollment by Academic Year */}
                    <div
                        className="p-2 border-1 border"
                        style={{
                            backgroundColor: "rgb(247, 247, 249)",
                            width: "100%",
                        }}
                    >
                        <h2>Enrollment by Academic Year</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={enrollmentCountsByYear}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="academic_year">
                                    {/* Display academic year titles */}
                                    <Label
                                        value="Academic Year"
                                        offset={0}
                                        position="insideBottom"
                                    />
                                </XAxis>
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#8884d8">
                                    <LabelList dataKey="total" position="top" />{" "}
                                    {/* Display total on top of bars */}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
