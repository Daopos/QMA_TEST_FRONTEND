import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import axiosClientPrincipal from "../../axoisclient/axios-client-principal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PrincipalSubjectView({ show, onHide, classId }) {
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    const [formValues, setFormValues] = useState({
        title: "",
        start: "",
        end: "",
        teacher_id: "",
        day: "",
    });

    useEffect(() => {
        if (show) {
            getTeachers();
            getSubjects();
        }
    }, [show]);

    const hanldeCloseAddSubject = () => {
        setShowAddSubject((prev) => !prev);
        if (!showAddSubject) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormValues({
            title: "",
            start: "",
            end: "",
            teacher_id: "",
        });
        setIsEditMode(false);
        setSelectedSubjectId(null);
    };

    const getSubjects = () => {
        axiosClientPrincipal
            .get(`/class/subjects/${classId}`)
            .then(({ data }) => {
                setSubjects(data.subjects);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });
    };

    const getTeachers = () => {
        axiosClientPrincipal
            .get("/all/teacher")
            .then(({ data }) => {
                setTeachers(data.teachers);
            })
            .catch((error) => {
                console.error("Error fetching teachers:", error);
            });
    };

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const payload = {
            ...formValues,
            classroom_id: classId,
        };

        if (isEditMode && selectedSubjectId) {
            axiosClientPrincipal
                .put(`/subjects/${selectedSubjectId}`, payload)
                .then(() => {
                    getSubjects(); // Refresh the subject list
                    hanldeCloseAddSubject(); // Close the modal
                    toast.success("Subject updated successfully!"); // Success toast
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Error updating subject."); // Error toast
                });
        } else {
            axiosClientPrincipal
                .post("/subjects", payload)
                .then(() => {
                    getSubjects(); // Refresh the subject list
                    hanldeCloseAddSubject(); // Close the modal
                    toast.success("Subject added successfully!"); // Success toast
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Error adding subject."); // Error toast
                });
        }
    };

    const handleEdit = (subject) => {
        setIsEditMode(true);
        setSelectedSubjectId(subject.id);
        setFormValues({
            title: subject.title,
            start: subject.start,
            end: subject.end,
            teacher_id: subject.teacher_id || "",
            day: subject.day || "",
        });
        setShowAddSubject(true);
    };

    const handleDelete = (subjectId) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            axiosClientPrincipal
                .delete(`/subjects/${subjectId}`)
                .then(() => {
                    getSubjects(); // Refresh the subject list
                    toast.success("Subject deleted successfully!"); // Success toast
                })
                .catch((error) => {
                    console.error("Error deleting subject:", error);
                    toast.error("Error deleting subject."); // Error toast
                });
        }
    };

    return (
        <>
            <Modal
                show={show}
                aria-labelledby="contained-modal-title-vcenter"
                onHide={onHide}
                dialogClassName="modal-60w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Subjects and Schedules
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between pb-3">
                        <h4>Subjects in Classroom</h4>
                        <button
                            className="btn btn-primary"
                            onClick={hanldeCloseAddSubject}
                        >
                            {showAddSubject ? "Cancel" : "Add Subject"}
                        </button>
                    </div>
                    {showAddSubject && (
                        <div
                            style={{
                                width: "300px",
                                marginBottom: "20px",
                                backgroundColor: "rgb(247, 247, 249)",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                        >
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        name="title"
                                        type="text"
                                        autoFocus
                                        placeholder="Ex. Science"
                                        value={formValues.title}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <div className="d-flex">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Time Start</Form.Label>
                                        <Form.Control
                                            name="start"
                                            type="time"
                                            value={formValues.start}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <div style={{ width: "20px" }}></div>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Time End</Form.Label>
                                        <Form.Control
                                            name="end"
                                            type="time"
                                            value={formValues.end}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                                <Form.Group className="mb-3">
                                    <Form.Label>Day</Form.Label>
                                    <Form.Select
                                        name="day"
                                        value={formValues.day}
                                        onChange={handleChange}
                                    >
                                        <option value="">None</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">
                                            Wednesday
                                        </option>
                                        <option value="Thursday">
                                            Thursday
                                        </option>
                                        <option value="Friday">Friday</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teacher</Form.Label>
                                    <Form.Select
                                        name="teacher_id"
                                        value={formValues.teacher_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map((teacher) => (
                                            <option
                                                key={teacher.id}
                                                value={teacher.id}
                                            >
                                                {teacher.fname} {teacher.lname}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Button onClick={handleSubmit}>
                                    {isEditMode ? "Update" : "Submit"}
                                </Button>
                            </Form>
                        </div>
                    )}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Title</th>
                                <th>Schedule</th>
                                <th>Teacher</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={subject.id}>
                                    <th>{index + 1}</th>
                                    <th>{subject.title}</th>
                                    <th>
                                        {`${
                                            subject.start
                                                ? subject.start
                                                : "N/A"
                                        }-${
                                            subject.end ? subject.end : "N/A"
                                        } ${subject.day ? subject.day : "N/A"}`}
                                    </th>
                                    <th>
                                        {subject.fname
                                            ? `${subject.lname}, ${
                                                  subject.fname
                                              } ${
                                                  subject.mname
                                                      ? subject.mname.charAt(
                                                            0
                                                        ) + "."
                                                      : ""
                                              }`
                                            : "N/A"}
                                    </th>
                                    <th>
                                        <button
                                            className="button-list button-orange"
                                            onClick={() => handleEdit(subject)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button-list button-red"
                                            onClick={() =>
                                                handleDelete(subject.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </>
    );
}
