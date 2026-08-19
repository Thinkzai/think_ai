const service = require("../services/enrollmentService");

const getEnrollments = async (req, res) => {
    try {
        const enrollments = await service.getAllEnrollments();

        res.status(200).json({
            success: true,
            data: enrollments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getEnrollmentById = async (req, res) => {
    try {

        const enrollment = await service.getEnrollmentById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: enrollment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createEnrollment = async (req, res) => {
    try {
        const enrollment =
            await service.createEnrollment(req.body);

        res.status(201).json({
            success: true,
            message: "Enrollment created successfully",
            data: enrollment
        });

    } catch (error) {
        console.error(
            "Create enrollment error:",
            error
        );

        const businessErrors = [
            "Selected batch not found",
            "Selected batch is full and no other available batch exists",
            "No available batch exists for this course",
            "Batch ID or Course ID is required"
        ];

        if (businessErrors.includes(error.message)) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create enrollment"
        });
    }
};

const updateEnrollment = async (req, res) => {
    try {

        const enrollment = await service.updateEnrollment(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: enrollment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteEnrollment = async (req, res) => {
    try {

        await service.deleteEnrollment(req.params.id);

        res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};