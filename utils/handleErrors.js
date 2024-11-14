const handleError = (res, error) => {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Error de validación', details: error.errors });
    }
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
};

module.exports = handleError;