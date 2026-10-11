const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const dbPath = path.join(__dirname, "../../../data/zerotrust.db");

class AuthService {
  async login(email, password) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    if (typeof email !== "string" ||
        typeof password !== "string") {
      return null;
    }

    const db = new DatabaseSync(dbPath, {
      readOnly: true
    });

    let user;

    try {
      const statement = db.prepare(`
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = ?
      `);

      user = statement.get(email.trim().toLowerCase());
    } finally {
      db.close();
    }

    if (!user) {
      return null;
    }

    const passwordValido = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordValido) {
      return null;
    }

    const usuario = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      {
        sub: String(usuario.id),
        role: usuario.role
      },
      jwtSecret,
      {
        expiresIn: "1h",
        algorithm: "HS256"
      }
    );

    return {
      token,
      user: usuario
    };
  }
}

module.exports = AuthService;
