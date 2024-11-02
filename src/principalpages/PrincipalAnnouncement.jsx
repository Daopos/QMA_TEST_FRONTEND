import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Announcement from "../components/Announcement";
import AddIcon from "@mui/icons-material/Add";
import axiosClientPrincipal from "../axoisclient/axios-client-principal";
import Dropdown from "react-bootstrap/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PrincipalAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [show, setShow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [filter, setFilter] = useState("all");
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const toRef = useRef(null);

    useEffect(() => {
        getAnnounce();
    }, []);

    const getAnnounce = () => {
        axiosClientPrincipal
            .get("/principal/announcements")
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
            title: titleRef.current?.value || "",
            desc: descRef.current?.value || "",
            to: toRef.current?.value || "",
            owner: "principal",
        };

        if (isEditMode && currentAnnouncement) {
            axiosClientPrincipal
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
            axiosClientPrincipal
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
                });
        }
    };

    const editAnn = (announcement) => {
        setIsEditMode(true);
        setCurrentAnnouncement(announcement);
        if (titleRef.current && descRef.current) {
            titleRef.current.value = announcement.title;
            descRef.current.value = announcement.desc;
        } else {
            console.error("Refs are not attached properly.");
        }
        handleShow();
    };

    const deleteAnn = (id) => {
        axiosClientPrincipal
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

    // Updated filter logic
    const filteredAnnouncements = announcements.filter((announcement) => {
        if (filter === "all") return true;
        if (filter === "admin") return announcement.owner === "admin";
        return announcement.to === filter;
    });

    return (
        <>
            <div className="list-body-container">
                <div style={{ gap: 40 }}>
                    <h2>Announcements</h2>

                    {/* Dropdown for filtering announcements */}
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="button-list button-blue"
                            onClick={handleShow}
                        >
                            <AddIcon sx={{ color: "#000000" }} />
                            Make New Announcement
                        </button>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">
                                Filter Announcements
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setFilter("all")}>
                                    All Announcements
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() =>
                                        setFilter("students and teacher")
                                    }
                                >
                                    All Students and Teachers
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setFilter("teacher")}
                                >
                                    All Teachers
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setFilter("admin")}
                                >
                                    From Admin
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Render filtered announcements */}
                <div className="d-flex flex-column gap-4 mt-5">
                    {filteredAnnouncements.map((data) => (
                        <Announcement
                            key={data.id}
                            title={data.title}
                            desc={data.desc}
                            date={data.created_at}
                            owner={data.owner}
                            onEdit={() => handleEdit(data)}
                            onDelete={() => handleDelete(data.id)}
                            currentUserRole={"principal"}
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
                                <option value="students and teacher">
                                    All Students and Teachers
                                </option>
                                <option value="teacher">All Teachers</option>
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
