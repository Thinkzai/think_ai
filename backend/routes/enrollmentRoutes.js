const express = require("express");

const router = express.Router();

const {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
} = require("../controllers/enrollmentController");

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment Management APIs
 */

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get("/", getEnrollments);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Enrollment details
 *       404:
 *         description: Enrollment not found
 */
router.get("/:id", getEnrollmentById);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentName
 *               - studentEmail
 *               - batchId
 *             properties:
 *               studentName:
 *                 type: string
 *                 example: Roopesh
 *               studentEmail:
 *                 type: string
 *                 example: roopesh@gmail.com
 *               batchId:
 *                 type: integer
 *                 example: 1
 *               enrollmentStatus:
 *                 type: string
 *                 example: ENROLLED
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 */
router.post("/", createEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *                 example: Roopesh H
 *               studentEmail:
 *                 type: string
 *                 example: roopesh@gmail.com
 *               batchId:
 *                 type: integer
 *                 example: 1
 *               enrollmentStatus:
 *                 type: string
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       404:
 *         description: Enrollment not found
 */
router.put("/:id", updateEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 */
router.delete("/:id", deleteEnrollment);

module.exports = router;