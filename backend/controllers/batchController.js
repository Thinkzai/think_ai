const service = require("../services/batchService");

const getBatches = async (req, res) => {
    try {
        const batches = await service.getAllBatches();

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

const getBatchById = async (req, res) => {
    try {
        const batch = await service.getBatchById(req.params.id);

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found"
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createBatch = async (req, res) => {
    try {
        const batch = await service.createBatch(req.body);

        res.status(201).json({
            success: true,
            data: batch
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateBatch = async (req, res) => {
    try {
        const batch = await service.updateBatch(req.params.id, req.body);

        res.status(200).json({
            success: true,
            data: batch
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteBatch = async (req, res) => {
    try {
        await service.deleteBatch(req.params.id);

        res.status(200).json({
            success: true,
            message: "Batch deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getBatchEnrollments = async (req, res) => {

    try {

        const enrollments =
            await service.getBatchEnrollments(req.params.batchId);

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

module.exports = {
    getBatches,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
    getBatchEnrollments
};