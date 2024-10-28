const jwt = require("jsonwebtoken")
const secretKey = process.env.JWTSECRETKEY

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Token en formato "Bearer <token>"
  if (!token) return res.status(403).json({ msg: "Token no proporcionado" });
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Token no válido" });
    req.user_id = decoded.user_id; // Añade el user_id a la solicitud
    next();
  });
};

module.exports = verifyToken
