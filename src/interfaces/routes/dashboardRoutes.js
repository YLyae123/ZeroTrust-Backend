const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Bienvenido al Dashboard protegido",
    user: {
      id: req.user.sub,
      role: req.user.role
    }
  });
});

module.exports = router;
