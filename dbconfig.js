import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    ssl: {
        rejectUnauthorized: false
      }
    };