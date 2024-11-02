import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";

export default function ViewStudentSubmission({
    show,
    handleClose,
    testId,
    studentId,
}) {
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false); // New state for save button loading

    const getSubmissionDetails = () => {
        axiosClientTeacher
            .get(`/test/${testId}/student/${studentId}/submission`)
            .then(({ data }) => {
                setSubmissionDetails(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load submission details.");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (show) {
            getSubmissionDetails();
        }
    }, [testId, studentId, show]);

    const handleScoreChange = (questionId, newScore) => {
        if (!submissionDetails?.answers) return;
        setSubmissionDetails((prevDetails) => ({
            ...prevDetails,
            answers: prevDetails.answers.map((answer) =>
                answer.question.id === questionId
                    ? { ...answer, score: newScore }
                    : answer
            ),
        }));
    };

    const handleSave = () => {
        if (saving) return; // Prevent multiple save clicks
        setSaving(true); // Set saving state to true
        // Prepare the payload with updated answer data
        const updatedAnswers = submissionDetails.answers.map((answer) => ({
            answerId: answer.id,
            questionId: answer.question.id,
            score: parseInt(answer.score, 10), // Ensure the score is an integer
        }));

        axiosClientTeacher
            .post(`/test/${testId}/student/${studentId}/submission/update`, {
                updatedAnswers,
            })
            .then((response) => {
                alert("Scores updated successfully!");
                setSaving(false); // Reset saving state
                handleClose(); // Close the modal after saving
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to update scores.");
                setSaving(false); // Reset saving state
            });
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {loading
                        ? "Loading..."
                        : `Submission by ${submissionDetails?.student?.surname}, ${submissionDetails?.student?.firstname}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <p>{error}</p>
                ) : submissionDetails ? (
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Question</th>
                                    <th>Correct Answer</th>
                                    <th>Answer</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissionDetails.answers.map(
                                    (answer, index) => (
                                        <tr key={index}>
                                            <td>{answer.question.type}</td>
                                            <td>{answer.question.title}</td>
                                            <td>
                                                {answer.question.correct_answer}
                                            </td>
                                            <td>{answer.answer}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={answer.score}
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            answer.question.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    min="0" // Add minimum value
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No submission details found.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={saving}
                >
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        "Save Scores"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
