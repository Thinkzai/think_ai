const service =
    require("../services/assessmentService");


const isValidationError = (message) => {
    return (
        message.includes(
            "must be a positive integer"
        ) ||
        message.includes(
            "must be an array"
        ) ||
        message.includes(
            "must be a required"
        ) ||
        message.includes(
            "is required"
        ) ||
        message.includes(
            "At least one answer is required"
        )
    );
};


/**
 * Create Assessment
 */
const createAssessment = async (
    req,
    res
) => {

    try {

        const assessment =
            await service.createAssessment(
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Assessment created successfully",
            data: assessment
        });

    } catch (error) {

        console.error(
            "Create assessment error:",
            error
        );

        if (
            isValidationError(
                error.message
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * Get Assessment By ID
 */
const getAssessmentById = async (
    req,
    res
) => {

    try {

        const assessment =
            await service.getAssessmentById(
                req.params.id
            );

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message:
                    "Assessment not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: assessment
        });

    } catch (error) {

        console.error(
            "Get assessment error:",
            error
        );

        if (
            error.message.includes(
                "must be a positive integer"
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * Submit Assessment
 */
const submitAssessment = async (
    req,
    res
) => {

    try {

        const submission =
            await service.submitAssessment(
                req.params.id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Assessment submitted successfully",
            data: submission
        });

    } catch (error) {

        console.error(
            "Submit assessment error:",
            error
        );


        /*
         * Invalid IDs / request data
         */
        if (
            isValidationError(
                error.message
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        /*
         * Assessment / enrollment not found
         */
        if (
            error.message ===
                "Assessment not found" ||

            error.message ===
                "Enrollment not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }


        /*
         * Enrollment/course/assessment
         * business rules.
         */
        if (
            error.message ===
                "Enrollment is not active" ||

            error.message ===
                "Batch is not active" ||

            error.message ===
                "Course is not active" ||

            error.message ===
                "This assessment does not belong to the enrolled course"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        /*
         * Invalid question/option submitted.
         */
        if (
            error.message.startsWith(
                "Question "
            ) ||

            error.message.startsWith(
                "Invalid option for question"
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * Get Assessment Analytics
 */
const getAssessmentAnalytics = async (
    req,
    res
) => {

    try {

        const analytics =
            await service.getAssessmentAnalytics(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        console.error(
            "Assessment analytics error:",
            error
        );


        if (
            error.message ===
            "Assessment not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }


        if (
            error.message.includes(
                "must be a positive integer"
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Assessment Submission Result
 */
const getAssessmentSubmissionResult = async (
    req,
    res
) => {

    try {

        const result =
            await service.getAssessmentSubmissionResult(
                req.params.submissionId
            );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Get assessment submission result error:",
            error
        );

        if (
            error.message.includes(
                "must be a positive integer"
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (
            error.message ===
            "Assessment submission not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// These routes share the service layer's validation and response envelope.
function assessmentHandler(operation, { status = 200, message } = {}) {
    return async (req, res) => {
        try {
            const data = await operation(req);
            return res.status(status).json({ success: true, ...(message ? { message } : {}), data });
        } catch (error) {
            const detail = error?.message || "Assessment request failed";
            const notFound = /not found$/i.test(detail);
            const invalid = isValidationError(detail) || detail.includes("is not active") ||
                detail === "This assessment does not belong to the enrolled course";
            return res.status(notFound ? 404 : invalid ? 400 : 500).json({
                success: false,
                message: notFound || invalid ? detail : "Assessment request failed"
            });
        }
    };
}

const getAllAssessments = assessmentHandler(req => service.getAllAssessments(req.query.moduleId));
const updateAssessment = assessmentHandler(req => service.updateAssessment(req.params.id, req.body));
const deleteAssessment = assessmentHandler(req => service.deleteAssessment(req.params.id), {
    message: "Assessment deleted successfully"
});
const getEnrollmentAssessmentStatus = assessmentHandler(req => service.getEnrollmentAssessmentStatus(req.params.enrollmentId));
const getAssessmentSubmissions = assessmentHandler(req => service.getSubmissionsByAssessmentId(req.params.id));
const startAssessment = assessmentHandler(async req => {
    const submission = await service.startAssessment(req.params.id, req.body.enrollmentId);
    return {
        submissionId: submission.id,
        assessmentId: submission.assessmentId,
        enrollmentId: submission.enrollmentId,
        status: submission.status,
        totalMarks: submission.totalMarks,
        score: submission.score,
        percentage: submission.percentage
    };
}, { message: "Assessment started successfully" });

const createCodingQuestion = assessmentHandler(req => service.createCodingQuestion(req.body), {
    status: 201, message: "Coding question created successfully"
});
const getCodingQuestions = assessmentHandler(req => service.getCodingQuestions(req.params.assessmentId));
const getCodingQuestionById = assessmentHandler(req => service.getCodingQuestionById(req.params.questionId));
const updateCodingQuestion = assessmentHandler(req => service.updateCodingQuestion(req.params.questionId, req.body), {
    message: "Coding question updated successfully"
});
const deleteCodingQuestion = assessmentHandler(req => service.deleteCodingQuestion(req.params.questionId), {
    message: "Coding question deleted successfully"
});
const createCodingTestCase = assessmentHandler(req => service.createCodingTestCase(req.params.questionId, req.body), {
    status: 201, message: "Coding test case created successfully"
});
const getCodingTestCases = assessmentHandler(req => service.getCodingTestCases(req.params.questionId));
const updateCodingTestCase = assessmentHandler(req => service.updateCodingTestCase(req.params.testCaseId, req.body), {
    message: "Coding test case updated successfully"
});
const deleteCodingTestCase = assessmentHandler(req => service.deleteCodingTestCase(req.params.testCaseId), {
    message: "Coding test case deleted successfully"
});

module.exports = {

    createAssessment,
    getAllAssessments,
    updateAssessment,
    deleteAssessment,

    getAssessmentById,
    getEnrollmentAssessmentStatus,
    startAssessment,

    submitAssessment,

    getAssessmentAnalytics,
    getAssessmentSubmissionResult,
    getAssessmentSubmissions,
    createCodingQuestion,
    getCodingQuestions,
    getCodingQuestionById,
    updateCodingQuestion,
    deleteCodingQuestion,
    createCodingTestCase,
    getCodingTestCases,
    updateCodingTestCase,
    deleteCodingTestCase
};
