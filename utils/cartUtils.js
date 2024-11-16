// Función para obtener el total de artículos en el carrito
const getTotalQuantity = (cart) => {
    if (!cart) return 0;
    return cart.reduce((acc, item) => acc + item.quantity, 0);
};

module.exports = { getTotalQuantity };