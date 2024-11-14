const bcrypt = require('bcrypt');

// Función auxiliar para encriptar la contraseña
const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

module.exports = hashPassword
