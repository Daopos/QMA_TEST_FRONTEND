import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosClientAdmin from "../../axoisclient/axios-client-admin";
import { ToastContainer, toast } from "react-toastify";
import randomatic from "randomatic";
import PrincipalClassView from "../principal/PrincipalClassView";

export default function AdminEmployeeEdit({
    show,
    onHide,
    email: initialEmail,
    fname: initialFname,
    mname: initialMname,
    lname: initialLname,
    address: initialAddress,
    type: initialType,
    id,
    getEmployees,
}) {
    const [email, setEmail] = useState(initialEmail);
    const [fname, setFname] = useState(initialFname);
    const [mname, setMname] = useState(initialMname || "");
    const [lname, setLname] = useState(initialLname || "");
    const [address, setAddress] = useState(initialAddress || "");
    const [type, setType] = useState(initialType);
    const [toastId, setToastId] = useState(null);

    const [checked, setChecked] = useState(false);

    const [confirmModal, setConfirmModal] = useState(false);
    const [mainModalOpen, setMainModalOpen] = useState(false);
    const handleChange = () => {
        setChecked(!checked);
    };

    const [payload, setPayload] = useState({});

    const handleClosePass = () => setShowPass(false);

    const [imageRef, setImageRef] = useState();
    const [file, setFile] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log("test");
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageRef(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setEmail(initialEmail);
        setFname(initialFname);
        setMname(initialMname || "");
        setLname(initialLname || "");
        setAddress(initialAddress || "");
        setType(initialType);
    }, [
        initialEmail,
        initialFname,
        initialMname,
        initialLname,
        initialAddress,
        initialType,
    ]);

    const handleCloseMainModal = () => {
        setMainModalOpen(false);
    };

    const handleCloseConfirm = () => {
        setConfirmModal(false);
    };

    const handleShowConfirm = () => {
        const test = fname;
        setPayload({
            email: email,
            fname: test,
            mname: mname,
            lname: lname,
            address: address,
            type: type,
        });
        if (email && fname && lname && address && type) {
            setConfirmModal(true);
            setMainModalOpen(false); // Close the main modal when showing the confirmation modal
        } else {
            // Handle case where not all required fields are filled
            const id = toast.error("Please fill in all required fields.");
            setToastId(id);
        }
    };
    const formData = new FormData();

    const onSubmit = (e) => {
        e.preventDefault();

        // Create a new FormData object to handle file upload
        formData.append("_method", "PUT");
        formData.append("email", email);
        formData.append("fname", fname);
        formData.append("mname", mname);
        formData.append("lname", lname);
        formData.append("address", address);
        formData.append("type", type);

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // Include image file if it exists
        if (file) {
            formData.append("image", file);
        }

        console.log("FormData entries:", Array.from(formData.entries()));

        axiosClientAdmin
            .post(`/employees/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                onHide();
                getEmployees();
                handleCloseConfirm();
                if (toast.isActive(toastId)) {
                    toast.update(toastId, {
                        render: "Employee edited successfully",
                        type: toast.TYPE.SUCCESS,
                    });
                } else {
                    const id = toast.success("Employee edited successfully");
                    setToastId(id);
                }
            })
            .catch((err) => {
                console.error("Error response:", err.response);
                const response = err.response;

                if (response && response.status === 422) {
                    const dataError = response.data.errors;

                    // Map through dataError and concatenate all error messages
                    const errorMessage = Object.values(dataError)
                        .flatMap((errors) => errors)
                        .join("\n");

                    if (toast.isActive(toastId)) {
                        toast.update(toastId, {
                            render: errorMessage,
                            type: toast.TYPE.ERROR,
                        });
                    } else {
                        const id = toast.error(errorMessage);
                        setToastId(id);
                    }
                } else {
                    // Handle other types of errors
                    console.error("Unexpected error:", err);
                }
            });
    };

    return (
        <>
            <Modal show={show && !confirmModal} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                autoFocus
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address*</Form.Label>
                            <Form.Control
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="name@example.com"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name*</Form.Label>
                            <Form.Control
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                type="text"
                                placeholder="first name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control
                                value={mname}
                                onChange={(e) => setMname(e.target.value)}
                                type="text"
                                placeholder="middle name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name*</Form.Label>
                            <Form.Control
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                type="text"
                                placeholder="last name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address*</Form.Label>
                            <Form.Control
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                placeholder="address"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Employee Type*</Form.Label>
                            <Form.Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {type === "Principal" && (
                                    <>
                                        <option value="Principal">
                                            Principal
                                        </option>
                                        <option value="Finance">Finance</option>
                                        <option value="Registrar">
                                            Registrar
                                        </option>
                                        <option value="Teacher">Teacher</option>
                                    </>
                                )}
                                {type === "Finance" && (
                                    <>
                                        <option value="Finance">Finance</option>
                                        <option value="Principal">
                                            Principal
                                        </option>
                                        <option value="Registrar">
                                            Registrar
                                        </option>
                                        <option value="Teacher">Teacher</option>
                                    </>
                                )}
                                {type === "Registrar" && (
                                    <>
                                        <option value="Registrar">
                                            Registrar
                                        </option>
                                        <option value="Principal">
                                            Principal
                                        </option>
                                        <option value="Finance">Finance</option>
                                        <option value="Teacher">Teacher</option>
                                    </>
                                )}
                                {type === "Teacher" && (
                                    <>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Principal">
                                            Principal
                                        </option>
                                        <option value="Finance">Finance</option>
                                        <option value="Registrar">
                                            Registrar
                                        </option>
                                    </>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowConfirm}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirm modal */}
            <Modal
                show={confirmModal}
                onHide={handleCloseConfirm}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="alert alert-danger" role="alert">
                        <h6>Note!</h6>
                        <small>
                            Updating this employee's information will overwrite
                            their current details. Please verify that the new
                            information is accurate and ensure that any changes
                            are communicated to the employee.
                        </small>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirm}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <PrincipalClassView />
        </>
    );
}
