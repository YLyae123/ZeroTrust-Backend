const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token de autenticación requerido"
    });
  }

  const token = authorization.slice(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado"
    });
  }
}

module.exports = verifyToken;
