require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "formintopdf",
  "root",
  process.env.DB_PASSWORD,
  {
    host: "localhost",
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
