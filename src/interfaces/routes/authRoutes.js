const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();
const authController = new AuthController();

router.post("/login", (req, res) => {
  return authController.login(req, res);
});

module.exports = router;
