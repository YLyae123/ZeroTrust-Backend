
const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");
const path = require("node:path");
const readline = require("node:readline/promises");

const dbPath = path.join(__dirname, "../../../data/zerotrust.db");

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  const allowedEmails = [
    "leonardo.aceituno89@unach.mx",
    "hazel.perez79@unach.mx"
  ];

  if (!allowedEmails.includes(email)) {
    console.log("Debes indicar un usuario autorizado.");
    return;
  }

  const db = new DatabaseSync(dbPath);

  try {
    const user = db.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).get(email);

    if (!user) {
      console.log("Usuario no encontrado.");
      return;
    }

    const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl._writeToOutput = function (text) {
  if (this.stdoutMuted) {
    if (text.includes("Nueva contraseña:")) {
      this.output.write(text);
    }
  } else {
    this.output.write(text);
  }
};

rl.stdoutMuted = true;

    let password;

    try {
      password = await rl.question("Nueva contraseña: ");
process.stdout.write("\n");
    } finally {
      rl.close();
    }

    if (password.length < 12) {
      console.log("La contraseña debe tener al menos 12 caracteres.");
      return;
    }

    const hash = await bcrypt.hash(password, 12);

    db.prepare(
      "UPDATE users SET password_hash = ? WHERE id = ?"
    ).run(hash, user.id);

    console.log("Contraseña actualizada correctamente.");
  } finally {
    db.close();
  }
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});
