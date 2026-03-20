// Exposes the grade scale from grade_references table.
const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/grades", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, grade_letter, grade_point, min_marks, max_marks, description
       FROM grade_references
       ORDER BY grade_point DESC`
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/grades failed:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch grades" });
  }
});

module.exports = router;
