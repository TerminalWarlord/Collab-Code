import type { Request, Response } from "express";
import * as z from "zod";
import bcrypt from "bcrypt";
import { getPool } from "../../lib/db.js";
import validator from "validator";

const pool = getPool();


export const registerController = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body) {
        return res.json({
            message: "Invalid body!"
        });
    }
    const schema = z.object({
        email: z.email(),
        password: z.string().min(8).max(16),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
    })

    const parsedData = await schema.safeParseAsync(body);

    if (!parsedData.success) {
        return res.json({
            message: "Invalid body!"
        });
    }
    const { email, password, first_name, last_name } = {
        ...parsedData.data,
        email: validator.normalizeEmail(parsedData.data.email),
        first_name: validator.escape(validator.trim(parsedData.data.first_name || "")),
        last_name: validator.escape(validator.trim(parsedData.data.last_name || "")),
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const { rows } = await pool.query(`SELECT * FROM users where email=$1`, [email]);
    if (rows.length) {
        return res.json({
            message: "User already exists!"
        }).status(403);
    }
    try {
        await pool.query(`INSERT INTO users (email, password, first_name, last_name)
            VALUES ($1, $2, $3, $4)`, [email, hashedPassword, first_name, last_name]);
    }
    catch {
        return res.json({
            message: "Failed to create account!",
        }).status(400)
    }

    return res.json({
        message: "Account created successfully",
    })
}