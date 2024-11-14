const bcrypt = require('bcrypt');
const jsw = require('jsonwebtoken');
const User = require('../models/Users');
const hashPassword = require('../utils/hashPassword');
const config = require('../config/config');

const userService = {

    getAllUsers: async () => {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw new Error(`Error al obtener los usuarios: ${error.message}`);
        }
    },

    getUserById: async (id) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('El usuario no existe');
            }
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    },

    createUser: async (userData) => {
        try {
            const hashedPassword = await hashPassword(userData.password);
            const user = await User.create({...userData, password: hashedPassword });
            return user;
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    },

    updateUser: async (id, userData) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('El usuario no existe');
            }
            if (userData.password) {
                const hashedPassword = await hashPassword(userData.password);
                userData.password = hashedPassword;
            }
            return await user.update(userData);
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    },

    deleteUser: async (id) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('El usuario no existe');
            }
            return await user.destroy();
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    },

    getUserByRole: async (role) => {
        try {
            const users = await User.findAll({ where: { role } });
            return users.length ? users: 'No se encontaron usuarios con ese rol';
        } catch (error) {
            throw new Error(`Error al obtener los usuarios con el rol ${role}: ${error.message}`);
        }
    },

    registerUser: async (userData) => {
        try {
            // Verificar si el mail ya está en uso
            const existingUser = await User.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new Error('El correo ya está registrado');
            };

            // Encriptar contraseña
            const hashedPassword = await hashPassword(userData.password);

            // Crear usuario 
            const newUser = await User.create({...userData, password: hashedPassword });
            return newUser;
        } catch (error) {
            throw new Error(`Error al registrar el usuario: ${error.message}`);
        }
    },

    loginUser: async (email, password) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('El correo no está registrado');
            }

            // verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Contraseña incorrecta');
            }

            // Generar Token JWT
            const token = jsw.sign(
                {
                id: user.id,
                email: user.email,
                role: user.role
                },
                config.jwt.secret,
                {
                    expiresIn: config.jwt.expiresIn
                }
            );

            return { user, token };
        } catch(error){
            throw new Error(`Error al iniciar sesión: ${error.message}`);
        }
    }
}

module.exports = userService;