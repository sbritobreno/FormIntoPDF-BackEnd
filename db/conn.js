require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("Connected to mySQL!");
} catch (err) {
  console.log(`Connection Failed: ${err}`);
}

// Reset all database data
//sequelize.sync({force: true});
sequelize.sync();

module.exports = sequelize;
