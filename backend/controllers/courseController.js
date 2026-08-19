const service = require("../services/courseService");

const getCourses = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";

        const courses = await service.getAllCourses(
            page,
            limit,
            search
        );

        res.status(200).json({
            success: true,
            data: courses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getCourseById = async (req, res) => {

    try {

        const course = await service.getCourseById(req.params.id);

        if (!course) {

            return res.status(404).json({
                success: false,
                message: "Course not found"
            });

        }

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const createCourse = async (req, res) => {

    try {

        const course = await service.createCourse(req.body);

        res.status(201).json({
            success: true,
            data: course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateCourse = async (req, res) => {

    try {

        const course = await service.updateCourse(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteCourse = async (req, res) => {

    try {

        await service.deleteCourse(req.params.id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getCourseBatches = async (req, res) => {
    try {

        const batches = await service.getCourseBatches(req.params.courseId);

        res.status(200).json({
            success: true,
            data: batches
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseBatches
};