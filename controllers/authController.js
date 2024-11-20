const userService = require("../services/userServices");
const { uuid } = require('uuidv4')

const authController = {
    registerUser: async (req, res) => {
        try {
            const newUser = await userService.registerUser(req.body);
            res.status(201).json({
                name: newUser.name,
                lastName: newUser.lastName, 
                message:'usuario registrado exitosamente'});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, user } = await userService.loginUser(email, password);
            //console.log('Resultado del loginUser:', {token, user});

            if (!user) {
                req.session.error = 'Credenciales inválidas'; // Guardar el error en la sesión
                return res.redirect('/login');
                // console.log('Credenciales inválidas');
                // return res.render('auth/login', { error: 'Credenciales inválidas' });
            }
            req.session.user = {
                userId: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                lastName: user.lastName 
            }
            //console.log('Datos de sesión:', JSON.stringify(req.session.user, null, 2));

            res.cookie('token', token, { httpOnly: true });

            if (user.role === 'admin' || user.role === 'collaborator') {
                return res.redirect('/admin')
            } else {
                return res.redirect('/')
            }
        } catch (error) {
            req.session.error = 'Credenciales inválidas';
            return res.redirect('/login')
            // console.error('Error en login:', error.message);
            // return res.render('auth/login', { error:'Ocurrió un error. Intenta nuevamente'});
        }
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.clearCookie('token');
        res.redirect('/login');
    },

    
};

module.exports = authController;