function adminAuth(req, res, next){
    if(req.session.user != undefined){ // Usuário logado, ou seja, esta gerado a sessão do usuário
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = adminAuth;