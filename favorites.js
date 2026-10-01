import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();


// ==========================================
// AUTHENTICATION MIDDLEWARE
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
// ADD FAVORITE
// ==========================================

router.post("/:propertyId", authenticateToken, async (req, res) => {

    try {

        const { propertyId } = req.params;

        const tenantId = req.user.id;


        // Only tenants can favorite properties

        if (req.user.role !== "tenant") {

            return res.status(403).json({
                message: "Only tenants can favorite properties"
            });

        }


        // Check property exists

        const [properties] = await db.query(
            "SELECT id FROM properties WHERE id = ?",
            [propertyId]
        );


        if (properties.length === 0) {

            return res.status(404).json({
                message: "Property not found"
            });

        }


        // Check existing favorite

        const [existing] = await db.query(
            `
            SELECT tenant_id
            FROM favorites
            WHERE tenant_id = ?
            AND property_id = ?
            `,
            [tenantId, propertyId]
        );


        if (existing.length > 0) {

            return res.status(409).json({
                message: "Property already in favorites"
            });

        }


        // Add favorite

        await db.query(
            `
            INSERT INTO favorites
            (tenant_id, property_id)
            VALUES (?, ?)
            `,
            [tenantId, propertyId]
        );


        res.status(201).json({
            message: "Property added to favorites"
        });


    } catch (error) {

        console.error(
            "Add favorite error:",
            error
        );

        res.status(500).json({
            message: "Failed to add favorite"
        });

    }

});


// ==========================================
// GET MY FAVORITES
// ==========================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const tenantId = req.user.id;


        const [favorites] = await db.query(`
            SELECT
                p.*,
                f.created_at AS favorited_at,
                u.name AS landlord_name
            FROM favorites f

            JOIN properties p
                ON f.property_id = p.id

            JOIN users u
                ON p.landlord_id = u.id

            WHERE f.tenant_id = ?

            ORDER BY f.created_at DESC
        `, [tenantId]);


        res.json(favorites);


    } catch (error) {

        console.error(
            "Get favorites error:",
            error
        );

        res.status(500).json({
            message: "Failed to load favorites"
        });

    }

});


// ==========================================
// REMOVE FAVORITE
// ==========================================

router.delete("/:propertyId", authenticateToken, async (req, res) => {

    try {

        const { propertyId } = req.params;

        const tenantId = req.user.id;


        const [result] = await db.query(
            `
            DELETE FROM favorites
            WHERE tenant_id = ?
            AND property_id = ?
            `,
            [tenantId, propertyId]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Favorite not found"
            });

        }


        res.json({
            message: "Property removed from favorites"
        });


    } catch (error) {

        console.error(
            "Remove favorite error:",
            error
        );

        res.status(500).json({
            message: "Failed to remove favorite"
        });

    }

});


export default router;