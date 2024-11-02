import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Announcement from "../components/Announcement";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import axiosClientAdmin from "../axoisclient/axios-client-admin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [show, setShow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [filter, setFilter] = useState("all"); // State for filtering
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const toRef = useRef(null);

    useEffect(() => {
        getAnnounce();
    }, []);

    const getAnnounce = () => {
        axiosClientAdmin
            .get("/admin/announcements")
            .then((response) => {
                setAnnouncements(response.data);
            })
            .catch((error) => {
                console.error("Error fetching announcements:", error);
            });
    };

    const handleClose = () => {
        setShow(false);
        setIsEditMode(false);
        setCurrentAnnouncement(null);
    };

    const handleShow = () => {
        setShow(true);
    };

    const addAnn = () => {
        const payload = {
            title: titleRef.current?.value || null,
            desc: descRef.current?.value || null,
            to: toRef.current?.value || null, // Include the 'to' field in the payload
            owner: "admin",
        };

        if (isEditMode && currentAnnouncement) {
            axiosClientAdmin
                .put(`/announcements/${currentAnnouncement.id}`, payload)
                .then((response) => {
                    getAnnounce();
                    handleClose();
                    toast.success(
                        response.data.message ||
                            "Announcement saved successfully"
                    );
                })
                .catch((error) => {
                    console.error("Error updating announcement:", error);
                    toast.error(
                        error.response?.data?.message ||
                            "Failed to save announcement"
                    );
                });
        } else {
            axiosClientAdmin
                .post("/announcements", payload)
                .then((response) => {
                    getAnnounce();
                    handleClose();
                    toast.success(
                        response.data.message ||
                            "Announcement saved successfully"
                    );
                })
                .catch((error) => {
                    console.error("Error creating announcement:", error);
                    toast.error(
                        error.response?.data?.message ||
                            "Failed to save announcement"
                    );
                });
        }
    };

    const editAnn = (announcement) => {
        setIsEditMode(true);
        setCurrentAnnouncement(announcement);
        if (titleRef.current && descRef.current && toRef.current) {
            titleRef.current.value = announcement.title;
            descRef.current.value = announcement.desc;
            toRef.current.value = announcement.to; // Set the 'to' field for editing
        } else {
            console.error("Refs are not attached properly.");
        }
        handleShow();
    };

    const deleteAnn = (id) => {
        axiosClientAdmin
            .delete(`/announcements/${id}`)
            .then((response) => {
                getAnnounce();
                toast.success(
                    response.data.message || "Announcement deleted successfully"
                );
            })
            .catch((error) => {
                console.error("Error deleting announcement:", error);
                toast.error(
                    error.response?.data?.message ||
                        "Failed to delete announcement"
                );
            });
    };

    const handleEdit = (announcement) => {
        editAnn(announcement);
    };

    const handleDelete = (id) => {
        deleteAnn(id);
    };

    // Function to filter the announcements based on the selected filter
    const filteredAnnouncements = () => {
        return announcements.filter((ann) => {
            if (filter === "all") {
                return true; // Show all announcements
            } else if (filter === "users") {
                return ann.to === "users"; // Show announcements for all users
            } else if (filter === "employees") {
                return ann.to === "employees"; // Show announcements for employees
            }
            return true; // Default case, just in case
        });
    };

    return (
        <>
            <div className="list-body-container">
                <div className="gap-4">
                    <h2>Announcement </h2>
                    <div className="d-flex justify-content-between align-items-center flex-lg-row flex-column gap-lg-0 gap-2">
                        <button
                            className="button-list button-blue"
                            onClick={handleShow}
                        >
                            <AddIcon sx={{ color: "#000000" }} />
                            Make New Announcement
                        </button>

                        {/* Dropdown to select the filter */}
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">
                                Filter Announcements
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setFilter("all")}>
                                    All Announcements
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setFilter("users")}
                                >
                                    All Users Announcements
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setFilter("employees")}
                                >
                                    Employees Announcements
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Display announcements based on the selected filter */}
                <div className="d-flex flex-column gap-4 mt-5">
                    {filteredAnnouncements().map((data) => (
                        <Announcement
                            key={data.id}
                            title={data.title}
                            desc={data.desc}
                            date={data.created_at}
                            owner={data.owner}
                            onEdit={() => handleEdit(data)}
                            onDelete={() => handleDelete(data.id)}
                            currentUserRole={"admin"} // Passing current user role as admin
                            recipient={data.to}
                        />
                    ))}
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditMode
                            ? "Edit Announcement"
                            : "Create an Announcement"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                ref={titleRef}
                                type="text"
                                placeholder="Ex. Meeting"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                ref={descRef}
                                as="textarea"
                                rows={8}
                                style={{ resize: "none" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Recipient</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                ref={toRef}
                            >
                                <option value="">None</option>
                                <option value="users">All Users</option>
                                <option value="employees">Employees</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addAnn}>
                        {isEditMode ? "Save Changes" : "Create Announcement"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}
