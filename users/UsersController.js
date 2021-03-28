const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{ email:email }}).then( user => {
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch(() => {
                res.redirect("/");
            });

        }else{ // Depois fazer uma tratativa de erro enviando uma mensagem no HTML que o usuário ja existe
            res.redirect("/admin/users/create");
        }
    });


});

// Rota de login de adminstrador
router.get("/login", (req, res) => {
    res.render("admin/users/login")
});

// Autenticação de admin
router.post("/authenticate", (req,res) => {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{ email:email }}).then(user => {
        if(user != undefined){// Caso exista um usuário
            // Validando senha
            var correctPass = bcrypt.compareSync(password,user.password);
            if(correctPass){ // Caso a senha esteja correta, é criado a sessão de login
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.json(req.session.user);
            }else{
                res.redirect("/login");
            }

        }else{// Criar uma mensagem de tratativa de usuário não encontrado
            res.redirect("/login");
        }
    });
});

module.exports = router;