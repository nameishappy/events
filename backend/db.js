import mysql from "mysql2/promise";

const createTableQuery = `
CREATE TABLE IF NOT EXISTS calendar_events (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const alterQuery = `
ALTER TABLE calendar_events ADD event_time TIME NOT NULL;
`;

export const connectToDb = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    // await connection.execute(alterQuery);
    // console.log("Calendar events table initialization completed successfully");
    console.log("Connected to MySQL");
    return connection;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};
