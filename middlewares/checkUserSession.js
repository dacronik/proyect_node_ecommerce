const checkUserSession = (req, res, next) =>{
    if (!req.session.user) {
        return res.redirect('/registro');
    }else{
        next();
    }
}

module.exports = checkUserSession;