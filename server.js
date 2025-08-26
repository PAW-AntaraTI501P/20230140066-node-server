require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi database
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "todo_app",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL Database");
});

// GET semua todos
app.get("/api/todos", (req, res) => {
  const query = "SELECT * FROM todos";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching todos:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST tambah todo
app.post("/api/todos", (req, res) => {
  const { task } = req.body;

  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "Task tidak boleh kosong" });
  }

  const query = "INSERT INTO todos (task, completed) VALUES (?, ?)";
  db.query(query, [task.trim(), false], (err, result) => {
    if (err) {
      console.error("Error inserting todo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({
      id: result.insertId,
      task: task.trim(),
      completed: false,
    });
  });
});

// PUT update todo (task + completed)
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  if (!task || typeof task !== "string") {
    return res.status(400).json({ error: "Task tidak valid" });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed harus boolean" });
  }

  const query = "UPDATE todos SET task = ?, completed = ? WHERE id = ?";
  db.query(query, [task.trim(), completed, id], (err, result) => {
    if (err) {
      console.error("Error updating todo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ id, task: task.trim(), completed });
  });
});

// DELETE hapus todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting todo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", id });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
