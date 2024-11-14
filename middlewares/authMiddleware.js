const authorizeSession = (roles = []) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (roles.length > 0 && !roles.includes(req.session.user.role)) {
            res.status(403).json({ message: 'Acceso denegado. No tienes permisos para acceder a esta área.' });
            return;
        }
        
        next();
    }
}
module.exports = authorizeSession;