const bcrypt = require('bcryptjs');

// Función para encriptar contraseñas
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Función para comparar contraseñas
const comparePasswords = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  encryptPassword,
  comparePasswords
}
