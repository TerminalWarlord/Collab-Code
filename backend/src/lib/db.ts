import { Pool } from "pg";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });
const DATABASE_URL = process.env.DATABASE_URL;

let pool: Pool;
export const getPool = () => {
    if (!pool) {
        pool = new Pool({
            connectionString: DATABASE_URL,
            max: 10
        })
    }
    return pool;
}

