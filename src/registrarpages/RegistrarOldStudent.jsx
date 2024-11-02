import React, { useEffect, useState } from "react";
import "../assets/css/list.css";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axiosClientRegistrar from "../axoisclient/axios-client-registrar";
import { useNavigate } from "react-router-dom";
import RegistrarEditStudent from "../components/registrar/RegistrarEditStudent";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Confirmation from "../components/Confirmation";
import OldStudentForm from "../components/registrar/OldStudentForm";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function RegistrarOldStudent() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [activeTab, setActiveTab] = useState("grade7");

    const [showEdit, setEdit] = useState(false);
    const [editStudent, setEditStudent] = useState();

    const handleShowEdit = () => setEdit(true);
    const handleCloseEdit = () => setEdit(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idConfirm, setIdConfirm] = useState(null);

    const handleConfirm = (id) => {
        setIdConfirm(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setIdConfirm(null);
    };

    const getStudents = () => {
        axiosClientRegistrar.get("/unenrolled/students").then(({ data }) => {
            setStudents(data);
            setFilteredStudents(data);
            console.log(data);
        });
    };

    useEffect(() => {
        getStudents();
    }, []);

    const handleEditClick = (data) => {
        setEditStudent(data);
        handleShowEdit();
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter((student) => {
            const fullName =
                `${student.surname} ${student.firstname} ${student.middlename}`.toLowerCase();
            return (
                student.surname.toLowerCase().includes(query) ||
                student.firstname.toLowerCase().includes(query) ||
                student.middlename.toLowerCase().includes(query) ||
                fullName.includes(query)
            );
        });
        setFilteredStudents(filtered);
        if (filtered.length > 0) {
            const gradeLevel = filtered[0].grade_level.toString();
            setActiveTab(`grade${gradeLevel}`);
        }
    };

    const renderTable = (studentsToRender) => {
        return (
            <table className="list-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>LRN</th>
                        <th>Name</th>
                        <th>Grade Level</th>
                        <th>Gender</th>
                        <th>Option</th>
                    </tr>
                </thead>
                <tbody>
                    {studentsToRender.map((data, index) => {
                        const studentName = `${data.student.surname}${
                            data.student.extension_name
                                ? ` ${data.student.extension_name}`
                                : ""
                        }, ${data.student.firstname}${
                            data.student.middlename
                                ? `, ${data.student.middlename.charAt(0)}.`
                                : ""
                        }`;

                        return (
                            <OverlayTrigger
                                key={index + 1}
                                placement="top"
                                overlay={
                                    <Tooltip
                                        id={`tooltip-${index + 1}`}
                                        style={{ position: "fixed" }}
                                    >
                                        <img
                                            src={
                                                data?.image ||
                                                "/img/profile.png"
                                            }
                                            alt="Profile"
                                            width={50}
                                        />
                                        <div>
                                            <strong>Full Name:</strong>{" "}
                                            {studentName} <br />
                                            <strong>LRN:</strong>{" "}
                                            {data.student.lrn} <br />
                                            <strong>Gender:</strong>{" "}
                                            {data.student.gender} <br />
                                            <strong>Grade Level:</strong>{" "}
                                            {data.grade_level}
                                        </div>
                                    </Tooltip>
                                }
                            >
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{data.student.lrn}</td>
                                    <td>{studentName}</td>
                                    <td>{data.grade_level}</td>
                                    <td>{data.student.gender}</td>
                                    <td>
                                        <button
                                            className="button-list button-orange"
                                            onClick={() =>
                                                handleEditClick(data.student)
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            </OverlayTrigger>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    // Grade filters here
    const studentsGrade7 = filteredStudents.filter(
        (student) => student.grade_level === "7"
    );
    const studentsGrade8 = filteredStudents.filter(
        (student) => student.grade_level === "8"
    );
    const studentsGrade9 = filteredStudents.filter(
        (student) => student.grade_level === "9"
    );
    const studentsGrade10 = filteredStudents.filter(
        (student) => student.grade_level === "10"
    );
    const studentsGrade11 = filteredStudents.filter(
        (student) => student.grade_level === "11"
    );
    const studentsGrade12 = filteredStudents.filter(
        (student) => student.grade_level === "12"
    );

    return (
        <>
            <div className="list-body-container">
                <div>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search.."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button className="search-input-btn">
                        <SearchIcon />
                    </button>
                </div>

                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Old Students</h2>
                    </div>
                    <div>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            id="uncontrolled-tab-example"
                            className="mb-3 tab-title"
                        >
                            <Tab eventKey="grade7" title="Grade 7">
                                {renderTable(studentsGrade7)}
                            </Tab>
                            <Tab eventKey="grade8" title="Grade 8">
                                {renderTable(studentsGrade8)}
                            </Tab>
                            <Tab eventKey="grade9" title="Grade 9">
                                {renderTable(studentsGrade9)}
                            </Tab>
                            <Tab eventKey="grade10" title="Grade 10">
                                {renderTable(studentsGrade10)}
                            </Tab>
                            <Tab eventKey="grade11" title="Grade 11">
                                {renderTable(studentsGrade11)}
                            </Tab>
                            <Tab eventKey="grade12" title="Grade 12">
                                {renderTable(studentsGrade12)}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
            {editStudent && (
                <OldStudentForm
                    show={showEdit}
                    onHide={handleCloseEdit}
                    initialValues={editStudent}
                    getStudents={getStudents}
                />
            )}
        </>
    );
}
