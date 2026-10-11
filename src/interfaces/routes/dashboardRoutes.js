const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

// Dashboard para ambos usuarios
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Bienvenido al Dashboard protegido",
    user: {
      id: req.user.sub,
      role: req.user.role
    }
  });
});

// Ruta exclusiva para el administrador
router.get(
  "/admin",
  verifyToken,
  requireRole("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Acceso autorizado al panel administrativo",
      user: {
        id: req.user.sub,
        role: req.user.role
      }
    });
  }
);

module.exports = router;
