const Sequelize = require("sequelize");
const connection = new Sequelize('guiapress', 'root', '1234',{
    host: 'localhost',
    port: 3307,
    dialect: 'mysql'
});

module.exports = connection;