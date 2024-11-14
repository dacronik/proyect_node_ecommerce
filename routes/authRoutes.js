const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// rutas para mostrar login y register

router.get('/login', (req, res) => {
    const error = req.session.error; // Obtener el error de la sesión
    delete req.session.error;
    res.render('auth/login', {error})

});
router.post('/login', authController.loginUser);

router.get('/registro', (req, res) => res.render('auth/registro'));
router.post('/register', authController.registerUser);

router.get('/logout', authController.logoutUser);

module.exports = router;