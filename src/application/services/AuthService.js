const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async login(email, password) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
      throw new Error("Configuración de autenticación incompleta");
    }

    const emailValido =
      typeof email === "string" &&
      email.trim().toLowerCase() === adminEmail.toLowerCase();

    const passwordValido =
      typeof password === "string" &&
      await bcrypt.compare(password, adminPasswordHash);

    if (!emailValido || !passwordValido) {
      return null;
    }

    const user = {
      id: 1,
      name: "Administrador",
      email: adminEmail,
      role: "admin"
    };

    const token = jwt.sign(
      {
        sub: String(user.id),
        role: user.role
      },
      jwtSecret,
      {
        expiresIn: "1h",
        algorithm: "HS256"
      }
    );

    return { token, user };
  }
}

module.exports = AuthService;
