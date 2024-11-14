const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        port: process.env.DB_PORT || 5433
    }
);

const connectDB = async () =>{
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos realizada con éxito');
    } catch (error) {
        console.log('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB}