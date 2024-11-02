import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import { useQuery } from "react-query";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import { toast, ToastContainer } from "react-toastify";

export default function TeacherClassworkSubmission() {
    const { classworkId } = useParams();
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [score, setScore] = useState(0);
    const [submissionId, setSubmissionId] = useState(null);

    const {
        data: classwork,
        isLoading: classworkLoading,
        error: classworkError,
        refetch: refetchClasswork,
    } = useQuery(["classwork", classworkId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/classworks/${classworkId}`
        );

        console.log(data);
        return data;
    });

    const {
        data: submissions,
        isLoading,
        error,
        refetch,
    } = useQuery(["classworkSubmissions", classworkId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/classwork/${classworkId}/submissions`
        );
        return data;
    });

    if (isLoading) return <div>Loading submissions...</div>;
    if (error) return <div>Error loading submissions</div>;

    // Helper function to open the modal with selected submission data
    const handleViewSubmission = (submission) => {
        setSelectedSubmission(submission);
        setShowModal(true);
        setSubmissionId(submission.id); // Set submissionId when opening the modal
        setScore(submission.score || 0); // Set the current score in the input field
    };

    const handleSubmitScore = async () => {
        try {
            await axiosClientTeacher.post(
                `/submission/${submissionId}/score`,
                { score } // Wrap score in an object
            );
            // Optionally, refresh the submission data or provide feedback
            // E.g., show a success message
            refetch();
            setShowModal(false); // Close the modal after successful submission
            toast.success("Score Saved");
        } catch (error) {
            console.error("Error updating score:", error);
            toast.error("The score is higher than the average overall score");
            // Optionally, handle error (e.g., show an error message)
        }
    };

    return (
        <>
            <div className="p-3">
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container align-items-center">
                        <h2>{classwork?.title}</h2>
                    </div>
                    <div className="d-flex justify-content-between list-title-container align-items-center">
                        <h2>Classwork Submissions</h2>
                        <h5>Overall Score: {classwork?.score}</h5>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>Student LRN</th>
                                    <th>Student Name</th>
                                    <th>Submission Date</th>
                                    <th>Score</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.student.lrn}</td>
                                        <td>
                                            {data.student.firstname}{" "}
                                            {data.student.surname}
                                        </td>
                                        <td>
                                            {new Date(
                                                data.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{data.score}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleViewSubmission(data)
                                                }
                                                className="button-list button-blue"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal to display files */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Submission Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSubmission && (
                        <Carousel data-bs-theme="dark" interval={null}>
                            {selectedSubmission.student_classworks.map(
                                (fileData, idx) => {
                                    const fileUrl = fileData.file_url;

                                    return (
                                        <Carousel.Item key={idx}>
                                            {fileData.file.endsWith(".docx") ? (
                                                <div
                                                    className="text-center"
                                                    style={{ height: "500px" }}
                                                >
                                                    <p>
                                                        This document is not
                                                        viewable directly.{" "}
                                                        <a
                                                            href={fileUrl}
                                                            download
                                                        >
                                                            Download here
                                                        </a>
                                                        .
                                                    </p>
                                                </div>
                                            ) : fileData.file.endsWith(
                                                  ".png"
                                              ) ||
                                              fileData.file.endsWith(".jpg") ? ( // Add more image formats as needed
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center", // Centers the content horizontally
                                                        alignItems:
                                                            "flex-start", // Aligns the content to the top vertically
                                                        overflow: "auto",
                                                        height: "500px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <img
                                                        src={fileUrl}
                                                        alt={`Submission ${idx}`}
                                                        style={{
                                                            width: "70%",
                                                            height: "auto",
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <iframe
                                                    title={`File ${idx}`}
                                                    src={fileUrl}
                                                    style={{
                                                        width: "100%",
                                                        height: "500px",
                                                        border: "none",
                                                    }}
                                                ></iframe>
                                            )}
                                        </Carousel.Item>
                                    );
                                }
                            )}
                        </Carousel>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <input
                        type="number"
                        placeholder="Enter score"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleSubmitScore}>
                        Save Score
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}
