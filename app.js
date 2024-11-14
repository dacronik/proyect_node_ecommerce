const express = require('express');
const { connectDB, sequelize } = require('./data/db');
const session = require('express-session');
const sessionConfig = require('./config/config').sessionKey
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorizeSession = require('./middlewares/authMiddleware');
const categoriasRouters = require('./routes/categoriesRoutes')
const productsRoutes = require('./routes/productsRoutes');
const path = require('path');

const viewRoutes = require('./routes/viewsRoutes');


const app = express();

// Middlewares
app.use(session(sessionConfig));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
})
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

const port = 3000;
connectDB();

sequelize.sync().then(() => {
    console.log('Modelos sincronizados con la base de datos')
})

// Middlewares
app.use(express.json());


// Rutas Principales 
// app.get('/', ViewsController.renderHomePage);
app.use(viewRoutes)
// Rutas de administración 
app.get('/admin', authorizeSession(['admin', 'collaborator']),(req, res) => {
    res.render('admin/admin');
});

app.use(authRoutes);
app.use('/admin/usuarios',authorizeSession(['admin', 'collaborator']),userRoutes);

app.use('/admin/categorias',authorizeSession(['admin', 'collaborator']), categoriasRouters);

app.use('/admin/productos', productsRoutes);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

//, authorizeSession(['admin', 'collaborator'])