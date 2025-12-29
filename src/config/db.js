// import sql from "mssql";
// import dotenv from "dotenv";

// dotenv.config();

// const config = {
//   user: process.env.DB_USER,       
//   password: process.env.DB_PASS,   
//   server: process.env.DB_HOST,     
//   database: process.env.DB_NAME,   
//   port: parseInt(process.env.DB_PORT, 10) || 1433,
//   options: {
//     encrypt: true,                 
//     trustServerCertificate: false
//   },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000
//   }
// };

// let poolPromise;

// export async function getPool() {
//   if (!poolPromise) {
//     poolPromise = sql.connect(config)
//       .then(pool => {
//         console.log("Connected to Azure SQL");
//         return pool;
//       })
//       .catch(err => {
//         console.error("Database connection failed", err);
//         throw err;
//       });
//   }
//   return poolPromise;
// }

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,                 // postgres-db.internal.lan or IP
  port: Number(process.env.DB_PORT) || 5432, // PostgreSQL port
  database: process.env.DB_NAME,             // quotes_db_prod
  user: process.env.DB_USER,                 // quotes_app_user_prod
  password: process.env.DB_PASS,

  // IMPORTANT: turn on later when TLS is configured
  ssl: process.env.PGSSL === "true"
    ? { rejectUnauthorized: true }
    : false,

  max: 10,                     // connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
  process.exit(1);
});

export default pool;
