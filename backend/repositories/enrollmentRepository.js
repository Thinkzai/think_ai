const prisma = require("../config/database");

const getAllEnrollments = async () => {
    return await prisma.enrollment.findMany({
        include: {
            batch: {
                include: {
                    course: true
                }
            }
        },
        orderBy: {
            id: "desc"
        }
    });
};


const getEnrollmentById = async (id) => {
    return await prisma.enrollment.findUnique({
        where: { id },
        include: {
            batch: {
                include: {
                    course: true
                }
            }
        }
    });
};


/*
 * Find an available batch for a course.
 *
 * A batch is considered available when:
 * - status is ACTIVE
 * - capacity has not been reached
 */
const findAvailableBatch = async (courseId) => {

    const batches = await prisma.batch.findMany({
        where: {
            courseId: Number(courseId),
            status: "ACTIVE"
        },
        include: {
            enrollments: {
                where: {
                    enrollmentStatus: {
                        in: ["ACTIVE", "ENROLLED"]
                    }
                }
            }
        },
        orderBy: {
            startDate: "asc"
        }
    });

    const availableBatch = batches.find(
        (batch) =>
            batch.enrollments.length < batch.capacity
    );

    return availableBatch || null;
};


/*
 * Create enrollment
 */
const createEnrollment = async (data) => {

    return await prisma.enrollment.create({
        data
    });
};


const updateEnrollment = async (id, data) => {
    return await prisma.enrollment.update({
        where: { id },
        data
    });
};


const deleteEnrollment = async (id) => {
    return await prisma.enrollment.delete({
        where: { id }
    });
};


module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    findAvailableBatch,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};