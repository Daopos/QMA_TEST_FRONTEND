import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";

export default function TeacherAdvisory() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = () => {
        axiosClientTeacher
            .get("/classlist/students")
            .then(({ data }) => {
                console.log(data);

                setStudents(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="list-body-container">
            <div>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search.."
                />
                <button className="search-input-btn">
                    <SearchIcon />
                </button>
            </div>
            <div className="list-container">
                <div className="d-flex justify-content-between list-title-container">
                    <h2>Advisory List</h2>
                </div>
                <div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>LRN</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{`${data.surname}${
                                        data.extension_name
                                            ? ` ${data.extension_name}`
                                            : ""
                                    }, ${data.firstname}${
                                        data.middlename
                                            ? `, ${data.middlename.charAt(0)}.`
                                            : ""
                                    }`}</td>
                                    <td>{data.lrn}</td>
                                    <td>{data.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
