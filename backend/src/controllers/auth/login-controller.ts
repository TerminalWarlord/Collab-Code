import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import bcrypt from "bcrypt";
import { getPool } from "../../lib/db.js";
import jwt from "jsonwebtoken";


const pool = getPool();
const JWT_SECRET = process.env.JWT_SECRET || "";

export const loginController = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body) {
        return res.status(401).json({
            message: "Enter your email and password"
        });
    }
    const schema = z.object({
        email: z.email(),
        password: z.string().min(8).max(16)
    });

    const parsedData = await schema.safeParseAsync(body);
    if (!parsedData.success) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    const { email, password } = parsedData.data;
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!rows || rows.length < 1) {
        return res.status(404).json({
            message: "Email doesn't exist in our database!"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (isPasswordValid) {
        const token = jwt.sign({
            userId: rows[0].id
        }, JWT_SECRET, { expiresIn: "30d" });
        return res.json({
            message: "Login Successful!",
            token: token
        })
    }
    else {
        return res.status(401).json({
            message: "Incorrect password",
        });
    }
}



export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token;
    if (!token || typeof token !== 'string') {
        return res.json({
            message: "Unauthorized!"
        }).status(403);
    }
    const { userId } = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!userId) {
        return res.json({
            message: "Invalid token!"
        }).status(401);
    }
    const { rows } = await pool.query("SELECT email FROM users WHERE id=$1", [userId])
    if(!rows || rows.length<1){
        return res.json({
            message: "Invalid user!"
        }).status(401);
    }
    next();
}