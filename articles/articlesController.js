const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Category = require("../categories/Category");
const Article = require("./Article");

router.get("/admin/articles", (req,res) => {
    Article.findAll({
        // Realizando JOIN da tabela Category para puxar os nomes deles ao buscar os artigos
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index",{articles: articles})
    });
});

router.get("/admin/articles/new", (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
    
})

// Criando rota para salvar artigos
router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });

});

// Deletando um artigo
router.post("/articles/delete", (req,res) => {
    var id = req.body.id;
    if( id != undefined) {
        if(!isNaN(id)){

            Article.destroy({
                where: { id:id }
            }).then(() => {
                res.redirect("/admin/articles");
            });
 
        }else { // Não for um número
            res.redirect("/admin/articles");
        }
    }else { // Se o id for nulo
        res.redirect("/admin/articles");
    }
});


module.exports = router;