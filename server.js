const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Test database connection
pool.connect()
  .then(() => console.log("Connected to RDS PostgreSQL ✅"))
  .catch(err => console.error("Error connecting to RDS ❌", err));


app.get("/", (req, res) => {
  res.send("Backend App is Running!");
});

app.get("/users", async (req, res) => {
  try {
    console.log('Fetching users...');
    const result = await pool.query("SELECT * FROM users;");
    console.log('Fetched users:', result.rows); 
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message); 
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
