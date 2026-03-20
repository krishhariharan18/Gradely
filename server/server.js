// Starts the Express API server for Gradely.
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const sgpaRoutes = require("./routes/sgpa");
const cgpaRoutes = require("./routes/cgpa");
const gradeRoutes = require("./routes/grades");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Enables cross-origin requests from the React client.
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Gradely API is running" });
});

app.use("/api", sgpaRoutes);
app.use("/api", cgpaRoutes);
app.use("/api", gradeRoutes);

app.listen(PORT, () => {
  console.log(`Gradely server listening on http://localhost:${PORT}`);
});
