const mysql = require("mysql2");
require('dotenv').config();

// Use Railway's environment variables when available, fall back to local .env for development
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "awds123",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "tienda",
  port: process.env.MYSQLPORT || 3306
};

// Alternatively, you can use the connection string if available
let db;
if (process.env.MYSQL_URL) {
  db = mysql.createConnection(process.env.MYSQL_URL);
} else {
  db = mysql.createConnection(dbConfig);
}

// Connect to the database
db.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL successfully");
    console.log(`Connected to database: ${dbConfig.database} on host: ${dbConfig.host}`);
  }
});

// Export the connection
module.exports = db;