const Sequelize = require("sequelize");
const connection = require("../database/connection");

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Forçar o Modal a criar a tabela
User.sync({force: false});

module.exports = User;