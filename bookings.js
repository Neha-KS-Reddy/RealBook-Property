import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ==========================================
// JWT AUTHENTICATION
// ==========================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token =
        authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        const user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = user;
        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

// ==========================================
// CREATE VIRTUAL TOUR BOOKING
// ==========================================

router.post("/", authenticateToken, async (req, res) => {

    const connection = await db.getConnection();

    try {

        if (req.user.role !== "tenant") {
            return res.status(403).json({
                message: "Only tenants can book virtual tours"
            });
        }

        const {
            property_id,
            booking_date,
            start_time
        } = req.body;

        if (
            !property_id ||
            !booking_date ||
            !start_time
        ) {
            return res.status(400).json({
                message: "Property, date and start time are required"
            });
        }

        // ------------------------------------------
        // VALIDATE 30-MINUTE SLOT
        // ------------------------------------------

        const timeParts = start_time.split(":");

        const hours = Number(timeParts[0]);
        const minutes = Number(timeParts[1]);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            minutes !== 0 &&
            minutes !== 30
        ) {
            return res.status(400).json({
                message:
                    "Virtual tours must start at :00 or :30"
            });
        }

        // ------------------------------------------
        // CALCULATE END TIME
        // ------------------------------------------

        const startMinutes =
            hours * 60 + minutes;

        const endMinutes =
            startMinutes + 30;

        if (endMinutes > 24 * 60) {
            return res.status(400).json({
                message: "Invalid booking time"
            });
        }

        const endHours =
            Math.floor(endMinutes / 60);

        const endMins =
            endMinutes % 60;

        const end_time =
            `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}:00`;

        const normalizedStart =
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

        // ------------------------------------------
        // START TRANSACTION
        // ------------------------------------------

        await connection.beginTransaction();

        // ------------------------------------------
        // CHECK PROPERTY
        // ------------------------------------------

        const [properties] =
            await connection.query(
                `
                SELECT id, landlord_id
                FROM properties
                WHERE id = ?
                `,
                [property_id]
            );

        if (properties.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message: "Property not found"
            });
        }

        // ------------------------------------------
        // CHECK OVERLAPPING BOOKINGS
        // ------------------------------------------

        const [existingBookings] =
            await connection.query(
                `
                SELECT id
                FROM bookings
                WHERE property_id = ?
                AND booking_date = ?
                AND status IN ('pending', 'confirmed')
                AND start_time < ?
                AND end_time > ?
                FOR UPDATE
                `,
                [
                    property_id,
                    booking_date,
                    end_time,
                    normalizedStart
                ]
            );

        if (existingBookings.length > 0) {

            await connection.rollback();

            return res.status(409).json({
                message:
                    "This virtual tour slot is already booked"
            });
        }

        // ------------------------------------------
        // CREATE BOOKING
        // ------------------------------------------

        const [result] =
            await connection.query(
                `
                INSERT INTO bookings
                (
                    property_id,
                    tenant_id,
                    booking_date,
                    start_time,
                    end_time,
                    status
                )
                VALUES (?, ?, ?, ?, ?, 'pending')
                `,
                [
                    property_id,
                    req.user.id,
                    booking_date,
                    normalizedStart,
                    end_time
                ]
            );

        await connection.commit();

        res.status(201).json({
            message:
                "Virtual tour booked successfully",
            booking_id: result.insertId,
            booking: {
                id: result.insertId,
                property_id,
                booking_date,
                start_time: normalizedStart,
                end_time,
                status: "pending"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Create booking error:",
            error
        );

        res.status(500).json({
            message: "Failed to create booking"
        });

    } finally {

        connection.release();
    }
});

// ==========================================
// GET TENANT BOOKINGS
// ==========================================

router.get("/my", authenticateToken, async (req, res) => {

    try {

        const [bookings] = await db.query(
            `
            SELECT
                b.*,
                p.title AS property_title,
                p.locality,
                p.city,
                p.cover_image,
                u.name AS landlord_name,
                u.phone AS landlord_phone
            FROM bookings b

            JOIN properties p
                ON b.property_id = p.id

            JOIN users u
                ON p.landlord_id = u.id

            WHERE b.tenant_id = ?

            ORDER BY
                b.booking_date DESC,
                b.start_time DESC
            `,
            [req.user.id]
        );

        res.json(bookings);

    } catch (error) {

        console.error(
            "Get tenant bookings error:",
            error
        );

        res.status(500).json({
            message: "Failed to load bookings"
        });
    }
});

// ==========================================
// GET LANDLORD BOOKINGS
// ==========================================

router.get("/landlord", authenticateToken, async (req, res) => {

    try {

        if (req.user.role !== "landlord") {
            return res.status(403).json({
                message:
                    "Only landlords can view landlord bookings"
            });
        }

        const [bookings] = await db.query(
            `
            SELECT
                b.*,

                p.title AS property_title,
                p.locality,
                p.city,

                u.name AS tenant_name,
                u.email AS tenant_email,
                u.phone AS tenant_phone

            FROM bookings b

            JOIN properties p
                ON b.property_id = p.id

            JOIN users u
                ON b.tenant_id = u.id

            WHERE p.landlord_id = ?

            ORDER BY
                b.booking_date ASC,
                b.start_time ASC
            `,
            [req.user.id]
        );

        res.json(bookings);

    } catch (error) {

        console.error(
            "Get landlord bookings error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load landlord bookings"
        });
    }
});

// ==========================================
// LANDLORD CONFIRM BOOKING
// ==========================================

router.put(
    "/:id/confirm",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can confirm bookings"
                });
            }

            const { id } = req.params;

            const [bookings] =
                await db.query(
                    `
                    SELECT
                        b.id

                    FROM bookings b

                    JOIN properties p
                        ON b.property_id = p.id

                    WHERE
                        b.id = ?
                        AND p.landlord_id = ?
                        AND b.status = 'pending'
                    `,
                    [id, req.user.id]
                );

            if (bookings.length === 0) {
                return res.status(404).json({
                    message:
                        "Pending booking not found"
                });
            }

            await db.query(
                `
                UPDATE bookings
                SET status = 'confirmed'
                WHERE id = ?
                `,
                [id]
            );

            res.json({
                message:
                    "Booking confirmed successfully"
            });

        } catch (error) {

            console.error(
                "Confirm booking error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to confirm booking"
            });
        }
    }
);

// ==========================================
// LANDLORD CANCEL BOOKING
// ==========================================

router.put(
    "/:id/cancel",
    authenticateToken,
    async (req, res) => {

        try {

            const { id } = req.params;

            let query = `
                SELECT b.id
                FROM bookings b
                JOIN properties p
                    ON b.property_id = p.id
                WHERE b.id = ?
            `;

            let params = [id];

            if (req.user.role === "landlord") {

                query += `
                    AND p.landlord_id = ?
                `;

                params.push(req.user.id);

            } else if (req.user.role === "tenant") {

                query += `
                    AND b.tenant_id = ?
                `;

                params.push(req.user.id);

            } else {

                return res.status(403).json({
                    message: "Access denied"
                });
            }

            const [bookings] =
                await db.query(
                    query,
                    params
                );

            if (bookings.length === 0) {
                return res.status(404).json({
                    message:
                        "Booking not found"
                });
            }

            await db.query(
                `
                UPDATE bookings
                SET status = 'cancelled'
                WHERE id = ?
                `,
                [id]
            );

            res.json({
                message:
                    "Booking cancelled successfully"
            });

        } catch (error) {

            console.error(
                "Cancel booking error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to cancel booking"
            });
        }
    }
);

export default router;