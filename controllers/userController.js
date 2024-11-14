const userService = require("../services/userServices");

const userController = {
    getAllUsers: async (req, res) => {
        try {
        const users = await userService.getAllUsers();
        res.status(200).render("admin/usuarios", { users });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(user);
        } catch (error) {
        res.status(500).json({ error: error.message, details: error.errors });
        }
    },
    getUserByRole: async (req, res) => {
        try {
        const { role } = req.params;
        const users = await userService.getUserByRole(role);
        res.status(200).json(users);
        } catch (error) {
        res.status(500).json({
                error: "Error al intentar obtener usuarios por rol",
                details: error.errors,
            });
        }
    },
    createUser: async (req, res) => {
        try {
        const newUser = await userService.createUser(req.body);
        res
            .status(201)
            .json({ message: "Usuario creado correctamente", user: newUser });
        } catch (error) {
        console.error(error);
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
            error: "Error de validación",
            details: error.errors,
            });
        }
        res
            .status(500)
            .json({ error: "Error interno del servidor", details: error.errors });
        }
    },
    updateUser: async (req, res) => {
        try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // Intenta actualizar el usuario
        await userService.updateUser(req.params.id, req.body);
        res
            .status(200)
            .json({ user, message: "Usuario actualizado exitosamente" });
        } catch (error) {
        console.error(error); // Registrar el error
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
            error: "Error de validación ",
            details: error.errors,
            });
        }
        res.status(500).json({
            error: "Error interno del servidor al intentar actualizar un usuario",
            details: error.message,
        });
        }
    },
    deleteUser: async (req, res) => {
        try {
        const deletedUser = await userService.deleteUser(req.params.id);

        res.status(200).json({
            user: deletedUser,
            message: "Usuario eliminado satisfactoriamente",
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al intentar eliminar al usuario" });
        }
    },
};


module.exports = userController;
