const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");


const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/articlesController");

// Modals do Article e Category
const Article = require("./articles/Article");
const Category = require("./categories/Category");

// View engine
app.set('view engine','ejs');

// Static
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!")
    }).catch((error) => {
        console.log(error);
    })
// Rotas de artigo e categoria
app.use("/",categoriesController);
app.use("/",articlesController);

// 

// Rotas
app.get("/", ( req, res) => {
    res.render("index");
});

app.listen(8080, () => {
    console.log("O servidor esta rodando!")
});