// Handles CGPA calculations from semester GPA inputs.
const express = require("express");

const router = express.Router();

router.post("/cgpa", async (req, res) => {
  try {
    const entries = Array.isArray(req.body) ? req.body : req.body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: "Provide GPA entries" });
    }

    const validGpas = entries
      .map((item) => Number(item.gpa))
      .filter((gpa) => Number.isFinite(gpa) && gpa >= 0 && gpa <= 10);

    if (validGpas.length === 0) {
      return res.status(400).json({ success: false, message: "No valid GPA values" });
    }

    const cgpa = validGpas.reduce((sum, gpa) => sum + gpa, 0) / validGpas.length;

    return res.json({
      success: true,
      cgpa: Number(cgpa.toFixed(2)),
      semesters: validGpas.length,
    });
  } catch (error) {
    console.error("POST /api/cgpa failed:", error.message);
    return res.status(500).json({ success: false, message: "Failed to calculate CGPA" });
  }
});

module.exports = router;
