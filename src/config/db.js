import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,       
  password: process.env.DB_PASS,   
  server: process.env.DB_HOST,     
  database: process.env.DB_NAME,   
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: true,                 
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

export async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(pool => {
        console.log("Connected to Azure SQL");
        return pool;
      })
      .catch(err => {
        console.error("Database connection failed", err);
        throw err;
      });
  }
  return poolPromise;
}
