import React, { useState } from "react";
import { useQuery } from "react-query";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import { Pagination } from "react-bootstrap"; // Import Pagination from react-bootstrap

export default function AdminAudit() {
    const { data, isLoading, error } = useQuery("adminAudit", async () => {
        const response = await axiosClientAdmin.get("/audit/all");
        console.log(response.data);
        return response.data;
    });

    const [selectedLevel, setSelectedLevel] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Set how many items you want per page

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace("T", " "); // Formats to YYYY-MM-DD HH:MM:SS
    };

    const userLevels = [
        "Registrar",
        "Finance",
        "Student",
        "Principal",
        "Parent",
        "Teacher",
    ];

    const handleFilterChange = (event) => {
        setSelectedLevel(event.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleDateFromChange = (event) => {
        setDateFrom(event.target.value);
        setCurrentPage(1); // Reset to first page on date change
    };

    const handleDateToChange = (event) => {
        setDateTo(event.target.value);
        setCurrentPage(1); // Reset to first page on date change
    };

    // Filter data based on the selected user level and date range
    const filteredData =
        data?.filter((audit) => {
            const auditDate = new Date(audit.created_at);
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;

            const isInUserLevel =
                !selectedLevel || audit.user_level === selectedLevel;
            const isInDateRange =
                (!fromDate || auditDate >= fromDate) &&
                (!toDate || auditDate <= toDate);

            return isInUserLevel && isInDateRange;
        }) || []; // Default to an empty array if data is undefined

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading)
        return (
            <div style={{ textAlign: "center", margin: "20px" }}>
                Loading...
            </div>
        );
    if (error)
        return (
            <div style={{ textAlign: "center", margin: "20px", color: "red" }}>
                Error: {error.message}
            </div>
        );

    return (
        <div className="list-body-container">
            <div className="mb-3 d-flex flex-column">
                <label htmlFor="user-level-filter" className="form-label">
                    Filter by User Level:
                </label>
                <select
                    id="user-level-filter"
                    className="form-select"
                    value={selectedLevel}
                    onChange={handleFilterChange}
                    style={{ width: "200px" }} // Inline style to set width
                >
                    <option value="">All</option>
                    {userLevels.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3 d-flex gap-3">
                <div>
                    <label htmlFor="date-from" className="form-label">
                        From:
                    </label>
                    <input
                        type="date"
                        id="date-from"
                        className="form-control"
                        value={dateFrom}
                        onChange={handleDateFromChange}
                    />
                </div>
                <div>
                    <label htmlFor="date-to" className="form-label">
                        To:
                    </label>
                    <input
                        type="date"
                        id="date-to"
                        className="form-control"
                        value={dateTo}
                        onChange={handleDateToChange}
                    />
                </div>
            </div>
            <div className="list-container">
                <div className="d-flex justify-content-between list-title-container">
                    <h2>Audit Trail</h2>
                </div>
                <div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>User Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((audit, index) => (
                                <tr key={index}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{formatDate(audit.created_at)}</td>
                                    <td>{audit.user}</td>
                                    <td>{audit.action}</td>
                                    <td>{audit.user_level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination component */}
                <Pagination className="mt-4 justify-content-center">
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
        </div>
    );
}
