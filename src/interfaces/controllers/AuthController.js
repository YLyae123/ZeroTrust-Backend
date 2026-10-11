const AuthService = require("../../application/services/AuthService");

const authService = new AuthService();

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body || {};

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
      ) {
        return res.status(400).json({
          message: "Correo y contraseña obligatorios"
        });
      }

      const result = await authService.login(email, password);

      if (!result) {
        return res.status(401).json({
          message: "Correo o contraseña incorrectos"
        });
      }

      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        token: result.token,
        user: result.user
      });

    } catch (error) {
      console.error("Error de autenticación:", error.message);

      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  }
}

module.exports = AuthController;
