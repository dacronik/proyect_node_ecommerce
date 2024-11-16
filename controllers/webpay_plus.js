const { WebpayPlus } = require('transbank-sdk');
const asyncHandler = require('../utils/asyncHandler');




exports.create = asyncHandler(async (req, res) => {
    console.log(typeof(req.session.buyOrder));
    let buyOrder = String(req.session.buyOrder || '');
    let sessionId = String(req.session.sessionId || '');
    let amount = req.session.totalAmount;

   // Validación de buyOrder
    if (typeof buyOrder !== 'string' || !buyOrder.trim()) {
        console.log('Error: El valor de buyOrder no es válido');
    }

    // Validación de sessionId
    if (typeof sessionId !== 'string' || !sessionId.trim()) {
        console.log('Error: El valor de sessionId no es válido');
    }

    // Validación de amount
    if (typeof amount !== 'number' || amount <= 0) {
        console.log('Error: El valor de amount no es válido');
    }
    let returnUrl = `${req.protocol}://${req.get("host")}/webpay_plus/commit`


    const createResponse = await new WebpayPlus.Transaction().create(
        sessionId,
        amount,
        buyOrder,
        returnUrl
    );

    res.render("webpay_plus/create",{
        token: createResponse.token,
        url: createResponse.url,
        buyOrder,
        sessionId,
        amount,
    })
}); 

//Confirmar transacción
exports.commit = asyncHandler(async (req,res) =>{
    const token = req.query.token_ws || req.body.token_ws;

    if(!token){
        return res.status(400).send('Token de transacción inválido');
    }

    //Confirmar la transacció con el token recibido
    const commitResponse = await new WebpayPlus.Transaction().commit(token);

    res.render("webpay_plus/commit",{
        token,
        commitResponse
    })
})