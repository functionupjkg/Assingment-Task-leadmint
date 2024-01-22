const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = async (plainTextPassword) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
  } catch (error) {
    return error;
  }
};
exports.comparePassword = async (plainTextPassword, hashedPassword) => {
  try {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    return error;
  }
};
