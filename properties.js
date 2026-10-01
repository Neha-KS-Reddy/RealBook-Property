import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

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

/* =========================
   GET ALL PROPERTIES
========================= */

router.get("/", async (req, res) => {
    try {
        const [properties] = await db.query(`
            SELECT
                p.*,
                u.name AS landlord_name
            FROM properties p
            JOIN users u
                ON p.landlord_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json(properties);

    } catch (error) {
        console.error("Get all properties error:", error);

        res.status(500).json({
            message: "Failed to load properties"
        });
    }
});


/* =========================
   GET LANDLORD PROPERTIES
========================= */

router.get(
    "/landlord/my-properties",
    authenticateToken,
    async (req, res) => {
        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can view their properties"
                });
            }

            const [properties] = await db.query(
                `
                SELECT
                    p.*,
                    u.name AS landlord_name
                FROM properties p
                JOIN users u
                    ON p.landlord_id = u.id
                WHERE p.landlord_id = ?
                ORDER BY p.created_at DESC
                `,
                [req.user.id]
            );

            res.json(properties);

        } catch (error) {

            console.error(
                "Get landlord properties error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load landlord properties"
            });
        }
    }
);


/* =========================
   ADD PROPERTY
========================= */

router.post(
    "/",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can add properties"
                });
            }

            const {
                title,
                description,
                locality,
                city,
                address,
                price,
                bhk,
                area_sqft,
                property_type,
                cover_image,
                available_from
            } = req.body;

            if (
                !title ||
                !locality ||
                !price ||
                !bhk
            ) {
                return res.status(400).json({
                    message:
                        "Title, locality, price and BHK are required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO properties
                (
                    landlord_id,
                    title,
                    description,
                    locality,
                    city,
                    address,
                    price,
                    bhk,
                    area_sqft,
                    property_type,
                    cover_image,
                    available_from
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    req.user.id,
                    title,
                    description || null,
                    locality,
                    city || "Mumbai",
                    address || null,
                    price,
                    bhk,
                    area_sqft || null,
                    property_type || "Apartment",
                    cover_image || null,
                    available_from || null
                ]
            );

            res.status(201).json({
                message:
                    "Property added successfully",
                property_id:
                    result.insertId
            });

        } catch (error) {

            console.error(
                "Add property error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to add property"
            });
        }
    }
);


/* =========================
   UPDATE PROPERTY
========================= */

router.put(
    "/:id",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can update properties"
                });
            }

            const { id } = req.params;

            const {
                title,
                description,
                locality,
                city,
                address,
                price,
                bhk,
                area_sqft,
                property_type,
                cover_image,
                available_from
            } = req.body;

            const [properties] = await db.query(
                `
                SELECT id
                FROM properties
                WHERE id = ?
                AND landlord_id = ?
                `,
                [id, req.user.id]
            );

            if (properties.length === 0) {
                return res.status(404).json({
                    message:
                        "Property not found or access denied"
                });
            }

            await db.query(
                `
                UPDATE properties
                SET
                    title = ?,
                    description = ?,
                    locality = ?,
                    city = ?,
                    address = ?,
                    price = ?,
                    bhk = ?,
                    area_sqft = ?,
                    property_type = ?,
                    cover_image = ?,
                    available_from = ?
                WHERE id = ?
                AND landlord_id = ?
                `,
                [
                    title,
                    description || null,
                    locality,
                    city || "Mumbai",
                    address || null,
                    price,
                    bhk,
                    area_sqft || null,
                    property_type || "Apartment",
                    cover_image || null,
                    available_from || null,
                    id,
                    req.user.id
                ]
            );

            res.json({
                message:
                    "Property updated successfully"
            });

        } catch (error) {

            console.error(
                "Update property error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update property"
            });
        }
    }
);


/* =========================
   DELETE PROPERTY
========================= */

router.delete(
    "/:id",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can delete properties"
                });
            }

            const { id } = req.params;

            const [properties] = await db.query(
                `
                SELECT id
                FROM properties
                WHERE id = ?
                AND landlord_id = ?
                `,
                [id, req.user.id]
            );

            if (properties.length === 0) {
                return res.status(404).json({
                    message:
                        "Property not found or access denied"
                });
            }

            await db.query(
                `
                DELETE FROM properties
                WHERE id = ?
                AND landlord_id = ?
                `,
                [id, req.user.id]
            );

            res.json({
                message:
                    "Property deleted successfully"
            });

        } catch (error) {

            console.error(
                "Delete property error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete property"
            });
        }
    }
);


/* =========================
   ADD GALLERY IMAGE
========================= */

router.post(
    "/:id/images",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can add images"
                });
            }

            const { id } = req.params;
            const { image_url } = req.body;

            if (!image_url) {
                return res.status(400).json({
                    message:
                        "Image URL is required"
                });
            }

            const [property] = await db.query(
                `
                SELECT id
                FROM properties
                WHERE id = ?
                AND landlord_id = ?
                `,
                [id, req.user.id]
            );

            if (property.length === 0) {
                return res.status(404).json({
                    message:
                        "Property not found or access denied"
                });
            }

            const [lastImage] = await db.query(
                `
                SELECT
                    COALESCE(MAX(sort_order), 0) AS last_order
                FROM property_images
                WHERE property_id = ?
                `,
                [id]
            );

            const nextOrder =
                lastImage[0].last_order + 1;

            const [result] = await db.query(
                `
                INSERT INTO property_images
                (
                    property_id,
                    image_url,
                    sort_order
                )
                VALUES (?, ?, ?)
                `,
                [
                    id,
                    image_url,
                    nextOrder
                ]
            );

            res.status(201).json({
                message:
                    "Gallery image added successfully",
                image_id:
                    result.insertId
            });

        } catch (error) {

            console.error(
                "Add gallery image error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to add gallery image"
            });
        }
    }
);


/* =========================
   DELETE GALLERY IMAGE
========================= */

router.delete(
    "/:id/images/:imageId",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "landlord") {
                return res.status(403).json({
                    message:
                        "Only landlords can delete images"
                });
            }

            const {
                id,
                imageId
            } = req.params;

            const [image] = await db.query(
                `
                SELECT pi.id
                FROM property_images pi
                JOIN properties p
                    ON pi.property_id = p.id
                WHERE pi.id = ?
                AND pi.property_id = ?
                AND p.landlord_id = ?
                `,
                [
                    imageId,
                    id,
                    req.user.id
                ]
            );

            if (image.length === 0) {
                return res.status(404).json({
                    message:
                        "Image not found or access denied"
                });
            }

            await db.query(
                `
                DELETE FROM property_images
                WHERE id = ?
                AND property_id = ?
                `,
                [
                    imageId,
                    id
                ]
            );

            res.json({
                message:
                    "Gallery image deleted successfully"
            });

        } catch (error) {

            console.error(
                "Delete gallery image error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete gallery image"
            });
        }
    }
);


/* =========================
   GET AMENITIES
========================= */

router.get(
    "/amenities/all",
    async (req, res) => {

        try {

            const [amenities] =
                await db.query(
                    `
                    SELECT id, name
                    FROM amenities
                    ORDER BY name ASC
                    `
                );

            res.json(amenities);

        } catch (error) {

            console.error(
                "Get amenities error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load amenities"
            });
        }
    }
);


/* =========================
   SAVE PROPERTY AMENITIES
========================= */

router.put(
    "/:id/amenities",
    authenticateToken,
    async (req, res) => {

        const connection =
            await db.getConnection();

        try {

            if (req.user.role !== "landlord") {
                connection.release();

                return res.status(403).json({
                    message:
                        "Only landlords can manage amenities"
                });
            }

            const { id } = req.params;
            const { amenity_ids } = req.body;

            if (!Array.isArray(amenity_ids)) {
                connection.release();

                return res.status(400).json({
                    message:
                        "amenity_ids must be an array"
                });
            }

            const [property] =
                await connection.query(
                    `
                    SELECT id
                    FROM properties
                    WHERE id = ?
                    AND landlord_id = ?
                    `,
                    [
                        id,
                        req.user.id
                    ]
                );

            if (property.length === 0) {

                connection.release();

                return res.status(404).json({
                    message:
                        "Property not found or access denied"
                });
            }

            await connection.beginTransaction();

            await connection.query(
                `
                DELETE FROM property_amenities
                WHERE property_id = ?
                `,
                [id]
            );

            for (const amenityId of amenity_ids) {

                await connection.query(
                    `
                    INSERT INTO property_amenities
                    (
                        property_id,
                        amenity_id
                    )
                    VALUES (?, ?)
                    `,
                    [
                        id,
                        amenityId
                    ]
                );
            }

            await connection.commit();

            connection.release();

            res.json({
                message:
                    "Amenities updated successfully"
            });

        } catch (error) {

            await connection.rollback();

            connection.release();

            console.error(
                "Save amenities error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update amenities"
            });
        }
    }
);


/* =========================
   GET SINGLE PROPERTY
========================= */

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [properties] =
            await db.query(
                `
                SELECT
                    p.*,
                    u.name AS landlord_name,
                    u.email AS landlord_email,
                    u.phone AS landlord_phone
                FROM properties p
                JOIN users u
                    ON p.landlord_id = u.id
                WHERE p.id = ?
                `,
                [id]
            );

        if (properties.length === 0) {
            return res.status(404).json({
                message:
                    "Property not found"
            });
        }

        const [images] =
            await db.query(
                `
                SELECT
                    id,
                    image_url,
                    sort_order
                FROM property_images
                WHERE property_id = ?
                ORDER BY sort_order ASC
                `,
                [id]
            );

        const [amenities] =
            await db.query(
                `
                SELECT
                    a.id,
                    a.name
                FROM amenities a
                JOIN property_amenities pa
                    ON a.id = pa.amenity_id
                WHERE pa.property_id = ?
                ORDER BY a.name ASC
                `,
                [id]
            );

        const property = {
            ...properties[0],
            images,
            amenities
        };

        res.json(property);

    } catch (error) {

        console.error(
            "Get single property error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load property"
        });
    }
});


export default router;