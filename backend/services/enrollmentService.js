const prisma = require("../config/database");
const repository = require("../repositories/enrollmentRepository");

const getAllEnrollments = async () => {
    return await repository.getAllEnrollments();
};

const getEnrollmentById = async (id) => {
    return await repository.getEnrollmentById(Number(id));
};


const createEnrollment = async (data) => {

    const batchId = Number(data.batchId);

    // Validate batch
    if (!batchId) {
        throw new Error("Batch is required");
    }

    // Get selected batch and its current enrollments
    const selectedBatch = await prisma.batch.findUnique({
        where: {
            id: batchId
        },
        include: {
            enrollments: {
                where: {
                    enrollmentStatus: {
                        in: ["ACTIVE", "ENROLLED"]
                    }
                }
            }
        }
    });

    if (!selectedBatch) {
        throw new Error("Selected batch not found");
    }


    // Check selected batch capacity
    const selectedBatchFull =
        selectedBatch.enrollments.length >=
        selectedBatch.capacity;


    // Selected batch has space
    if (
        selectedBatch.status === "ACTIVE" &&
        !selectedBatchFull
    ) {

        return await repository.createEnrollment({
            studentName: data.studentName,
            studentEmail: data.studentEmail,
            batchId: selectedBatch.id,
            enrollmentStatus:
                data.enrollmentStatus || "ENROLLED"
        });
    }


    // Selected batch is full
    // Find another available batch
    const alternativeBatch =
        await repository.findAvailableBatch(
            selectedBatch.courseId
        );


    if (!alternativeBatch) {
        throw new Error(
            "Selected batch is full and no other available batch exists"
        );
    }


    // Automatically assign alternative batch
    return await repository.createEnrollment({
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        batchId: alternativeBatch.id,
        enrollmentStatus:
            data.enrollmentStatus || "ENROLLED"
    });
};


const updateEnrollment = async (id, data) => {
    return await repository.updateEnrollment(
        Number(id),
        data
    );
};


const deleteEnrollment = async (id) => {
    return await repository.deleteEnrollment(
        Number(id)
    );
};


module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};