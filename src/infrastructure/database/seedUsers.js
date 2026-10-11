const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");
const path = require("node:path");
const readline = require("node:readline/promises");

const dbPath = path.join(__dirname, "../../../data/zerotrust.db");

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const users = [
  {
    name: "Leonardo",
    email: "leonardo.aceituno89@unach.mx",
    role: "admin"
  },
  {
    name: "Hazel",
    email: "hazel.perez79@unach.mx",
    role: "user"
  }
];

  const db = new DatabaseSync(dbPath);

  try {
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(email) DO NOTHING
    `);

    for (const user of users) {
      const existing = db.prepare(
        "SELECT id FROM users WHERE email = ?"
      ).get(user.email);

      if (existing) {
        console.log(`Ya existe: ${user.email}`);
        continue;
      }

      const password = await rl.question(
        `Contraseña para ${user.email}: `
      );

      if (password.length < 12) {
        console.log("La contraseña debe tener al menos 12 caracteres.");
        continue;
      }

      const hash = await bcrypt.hash(password, 12);

      insert.run(user.name, user.email, hash, user.role);

      console.log(`Usuario registrado: ${user.email}`);
    }
  } finally {
    db.close();
    rl.close();
  }
}

main().catch((error) => {
  console.error("Error al registrar usuarios:", error.message);
  process.exitCode = 1;
});
