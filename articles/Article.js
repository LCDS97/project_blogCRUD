const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// hasMany (Uma categoria tem muitos artigos) Relacionamento: 1 - Para - Muitos
Category.hasMany(Article)

// belongsTo (Um artigo pertence a uma categoria) Relacionamento: 1- Para -1
Article.belongsTo(Category);

// Forçar o Modal a criar a tabela
Article.sync({force: false});

module.exports = Article;