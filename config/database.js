require("dotenv").config();
const { Sequelize } = require("sequelize");

const sslConfig = 
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Para certificados autofirmados
          },
        },
      }
    : {}; // En desarrollo, no usar SSL

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    ...sslConfig, // Aplica la configuración condicional
  }
);

module.exports = sequelize;