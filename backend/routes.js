const express = require('express'); 
const router = express.Router(); 

const { crearCheckout, consultarPagoHandler, obtenerIpCliente } = require("./datafast");

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Genera un checkoutId de Datafast
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *                 example: "92.00"
 *     responses:
 *       200:
 *         description: CheckoutId generado
 *       500:
 *         description: Error al generar checkoutId
 */
router.post('/checkout', crearCheckout)

/**
 * @swagger
 * /checkout/resultado:
 *   get:
 *     summary: Consulta el resultado de un pago usando el checkoutId
 *     description: Este endpoint permite consultar el estado de un pago utilizando el checkoutId proporcionado por Datafast.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del checkout recibido desde Datafast.
 *     responses:
 *       200:
 *         description: Detalles del estado de pago.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Código de estado de la transacción.
 *                     description:
 *                       type: string
 *                       description: Descripción del estado de la transacción.
 *       500:
 *         description: Error al consultar el estado del pago.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error ocurrido al intentar consultar el pago.
 *       400:
 *         description: Bad Request, si el parámetro 'id' falta o está mal formado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error por falta de parámetro 'id'.
 */
router.get('/checkout/resultado', consultarPagoHandler);

/**
 * @swagger
 * /cliente-ip:
 *   get:
 *     summary: Obtiene la dirección IP del cliente
 *     description: Retorna la IP pública del cliente que hace la solicitud.
 *     responses:
 *       200:
 *         description: IP obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                   example: "186.46.123.22"
 */
router.get('/cliente-ip', obtenerIpCliente); 

module.exports = router;