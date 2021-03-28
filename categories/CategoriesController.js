const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

/*router.get("/categories", (req,res) => {
    res.send("Rota de Categorias")
});
*/

// Renderizar a página de criação de categoria
router.get("/admin/categories/new", adminAuth, (req,res) => {
    res.render("admin/categories/new");
});

// Criando e salvando uma categoria
router.post("/categories/save", adminAuth, (req, res) => {
    var title = req.body.title;
    if(title != undefined) {
        
        Category.create({
            title: title,
            // Slug é uma versão conversão do titulo para URL para ser utilizada em rota, Ex: Titulo: Desenvolvimento Web => Slug: desenvolvimento-web
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })

    }else{
        res.redirect("/admin/categories/new");
    }
});

// Exibindo as categorias no HTML
router.get("/admin/categories", adminAuth, (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });


});

// Deletando uma categoria
router.post("/categories/delete", adminAuth, (req,res) => {
    var id = req.body.id;
    if( id != undefined) {
        if(!isNaN(id)){

            Category.destroy({
                where: { id:id }
            }).then(() => {
                res.redirect("/admin/categories");
            });
 
        }else { // Não for um número
            res.redirect("/admin/categories");
        }
    }else { // Se o id for nulo
        res.redirect("/admin/categories");
    }
});

// Rota de Edição
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){

            res.render("admin/categories/edit",{category: category})

        }else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

// Atualizando categorias no banco
router.post("/categories/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title) },{
        where: { id:id }
    }).then(() => {
        res.redirect("/admin/categories");
    })
});

module.exports = router;