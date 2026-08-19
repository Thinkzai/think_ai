const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const courseRoutes = require("./routes/courseRoutes");
const batchRoutes = require("./routes/batchRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Thinkz LMS API",
            version: "1.0.0",
            description: "Course, Batch and Enrollment Management APIs"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./routes/*.js"] // Your routes folder is directly under backend
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Thinkz LMS Backend Running Successfully"
    });
});

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/enrollments", enrollmentRoutes);

module.exports = app;