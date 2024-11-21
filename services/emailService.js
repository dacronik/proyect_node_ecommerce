;
const nodemailer = require('nodemailer');
const config = require('../config/config');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.emailKey.user,
        pass: config.emailKey.password
    }
})

// Verificar conexión SMTP
transporter.verify((error, success) => {
    if (error) {
        console.error("Error al configurar el servicio de email:", error);
    } else {
        console.log("Servidor de correo listo para enviar emails.");
    }
});
// Función para enviar emails
const sendTransactionEmail = async (userEmail, transactionData) => {
    const { buyOrder, totalAmount, cart } = transactionData;

    // Plantilla HTML para el email
    const emailHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #2c3e50;">¡Gracias por tu compra en nuestra juguetería!</h2>
            <p>Hola, gracias por confiar en nosotros. Aquí tienes los detalles de tu transacción:</p>
            <ul>
                <li><strong>Número de Orden:</strong> ${buyOrder}</li>
                <li><strong>Total Pagado:</strong> $${totalAmount.toLocaleString()}</li>
            </ul>
            <h3>Productos:</h3>
            <ul>
                ${cart.map(item => `
                    <li>${item.name} (Cantidad: ${item.quantity}) - $${item.price.toLocaleString()}</li>
                `).join('')}
            </ul>
            <p style="color: #34495e;">¡Esperamos que disfrutes tus productos!</p>
            <footer style="margin-top: 20px; text-align: center; color: #95a5a6;">
                <img src="https://via.placeholder.com/150x50?text=Logo" alt="Logo" style="max-width: 150px;">
                <p>&copy; ${new Date().getFullYear()} Nuestra Juguetería</p>
            </footer>
        </div>
    `;

    // Configuración del email
    const mailOptions = {
        from: '"Dev-Toys" <dacronik@gmail.com>', // Remitente
        to: userEmail, // Destinatario
        subject: "Detalles de tu compra",
        html: emailHTML, // Cuerpo del email en HTML
    };

    // Enviar email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email enviado a:", userEmail);
    } catch (error) {
        console.error("Error al enviar el email:", error);
    }
};

module.exports = {
    sendTransactionEmail,
};