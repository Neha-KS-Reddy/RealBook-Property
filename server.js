import authRoutes from "./routes/auth.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import propertyRoutes from "./routes/properties.js";
import favoriteRoutes from "./routes/favorites.js";
import bookingRoutes from "./routes/bookings.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// ================================
// MIDDLEWARE
// ================================

app.use(cors());

app.use(express.json());


// ================================
// BASIC TEST ROUTE
// ================================

app.get("/", (req, res) => {

    res.json({
        message: "RealBook Property API is running"
    });

});


// ================================
// DATABASE TEST
// ================================

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        res.json({

            message: "MySQL connected successfully",

            database: rows

        });

    } catch (error) {

        console.error(
            "Database error:",
            error
        );

        res.status(500).json({

            message: "Database connection failed",

            error: error.message

        });

    }

});


// ================================
// PROPERTY ROUTES
// ================================

app.use(
    "/api/properties",
    propertyRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/favorites",
    favoriteRoutes
);

app.use("/api/bookings", bookingRoutes);

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `RealBook backend running on http://localhost:${PORT}`
    );

});