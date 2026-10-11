require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./interfaces/routes/authRoutes");
const dashboardRoutes = require("./interfaces/routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "10.1.249.69";

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend Zero Trust funcionando"
  });
});

app.listen(PORT, HOST, () => {
  console.log(`API funcionando en http://${HOST}:${PORT}`);
});
