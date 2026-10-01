import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            phone
        } = req.body;


        // Validate required fields

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // Validate role

        const userRole =
            role === "landlord"
                ? "landlord"
                : "tenant";


        // Check existing user

        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                message: "Email already registered"
            });

        }


        // Hash password

        const passwordHash =
            await bcrypt.hash(password, 10);


        // Create user

        const [result] = await db.query(
            `
            INSERT INTO users
            (name, email, password_hash, role, phone)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                passwordHash,
                userRole,
                phone || null
            ]
        );


        // Create JWT

        const token = jwt.sign(
            {
                id: result.insertId,
                name,
                email,
                role: userRole
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.status(201).json({

            message: "Registration successful",

            token,

            user: {
                id: result.insertId,
                name,
                email,
                role: userRole,
                phone: phone || null
            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Registration failed"
        });

    }

});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validate

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user

        const [users] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                password_hash,
                role,
                phone
            FROM users
            WHERE email = ?
            `,
            [email]
        );


        if (users.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const user = users[0];


        // Compare password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Create JWT

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Login failed"
        });

    }

});


export default router;