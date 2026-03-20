// Serves academic metadata and computes SGPA using subject credits.
const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/programs", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name
       FROM programs
       ORDER BY name ASC`
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/programs failed:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch programs" });
  }
});

router.get("/semesters", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, semester_number, label
       FROM semesters
       ORDER BY semester_number ASC`
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/semesters failed:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch semesters" });
  }
});

router.get("/subjects", async (req, res) => {
  try {
    const programId = Number(req.query.program);
    const semesterId = Number(req.query.semester);

    if (!programId || !semesterId) {
      return res.status(400).json({
        success: false,
        message: "Query params 'program' and 'semester' are required",
      });
    }

    const [rows] = await pool.query(
      `SELECT su.id, su.name, su.credits
       FROM program_semester_subjects pss
       JOIN subjects su ON su.id = pss.subject_id
       WHERE pss.program_id = ? AND pss.semester_id = ?
       ORDER BY su.name ASC`,
      [programId, semesterId]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/subjects failed:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch subjects" });
  }
});

router.post("/sgpa", async (req, res) => {
  try {
    const entries = Array.isArray(req.body) ? req.body : req.body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of { subject_id, grade_point } entries",
      });
    }

    const subjectIds = entries.map((item) => Number(item.subject_id)).filter((id) => id > 0);
    if (subjectIds.length === 0) {
      return res.status(400).json({ success: false, message: "No valid subject_id values" });
    }

    const [subjects] = await pool.query(
      `SELECT id, credits
       FROM subjects
       WHERE id IN (?)`,
      [subjectIds]
    );

    const creditMap = new Map(subjects.map((subject) => [subject.id, Number(subject.credits) || 0]));

    let weightedSum = 0;
    let totalCredits = 0;

    entries.forEach((item) => {
      const subjectId = Number(item.subject_id);
      const gradePoint = Number(item.grade_point);
      const credits = creditMap.get(subjectId) || 0;

      if (!Number.isFinite(gradePoint) || gradePoint < 0 || credits <= 0) {
        return;
      }

      weightedSum += credits * gradePoint;
      totalCredits += credits;
    });

    const sgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

    return res.json({
      success: true,
      sgpa: Number(sgpa.toFixed(2)),
      totalCredits,
      weightedSum: Number(weightedSum.toFixed(2)),
    });
  } catch (error) {
    console.error("POST /api/sgpa failed:", error.message);
    return res.status(500).json({ success: false, message: "Failed to calculate SGPA" });
  }
});

module.exports = router;
