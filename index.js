const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/connection");


const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");


// Modals do Article e Category
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");



// View engine
app.set('view engine','ejs');

// Sessions
app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 30000 }
}))
// Para sistemas grandes ou médio porte, utiliza o storage "Redis"

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
app.use("/",usersController);



// Rotas
app.get("/", ( req, res) => {
    Article.findAll({
        order: [['id','DESC']],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });

  
    });
});

// Rota do slug para exibição do artigo
app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: { slug:slug }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else {
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
});

// Criando a filtragem de artigos baseado na categoria cadastrada
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: { slug:slug },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });

        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })

})

app.listen(8080, () => {
    console.log("O servidor esta rodando!")
});