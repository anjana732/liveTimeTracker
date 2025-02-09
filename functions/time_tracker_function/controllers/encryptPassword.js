var catalyst = require('zcatalyst-sdk-node');

const crypto = require('crypto');
const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log("Hashed Password:", hashedPassword);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  };

  module.exports = {
    hashPassword
  }