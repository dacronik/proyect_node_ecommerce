// Función para actualizar el badge del carrito dinámicamente
function updateCartBadge() {
    fetch('/carrito/total-quantity')
        .then(response => response.json())
        .then(data => {
            const badge = document.querySelector('#cart-badge');
            if (badge) {
                badge.textContent = data.totalQuantity; // Actualiza el badge con la cantidad total
            }
        })
        .catch(error => console.error('Error al actualizar el badge del carrito:', error));
}

// Llamar esta función cuando la página cargue
document.addEventListener('DOMContentLoaded', updateCartBadge);