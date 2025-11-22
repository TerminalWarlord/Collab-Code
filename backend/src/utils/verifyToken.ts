import jwt from "jsonwebtoken";
import { getPool } from "../lib/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "";
const pool = getPool();

export async function verifyJwt(token: string){
    try{
        const {userId} = jwt.verify(token, JWT_SECRET) as {userId: number};
        if(!userId){
            return null;
        }
        const {rows} = await pool.query("SELECT id from users where id=$1", [userId]);
        if(!rows || rows.length<1){
            return null;
        }
        return rows[0].id;
    }
    catch{
        return null;
    }
}