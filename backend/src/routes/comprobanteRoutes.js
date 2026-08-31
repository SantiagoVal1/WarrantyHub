const express = require('express');

const {
    registrarComprobante,
    consultarComprobante
} = require('../controllers/comprobanteController');

const router = express.Router();


// Registrar comprobante
router.post('/', registrarComprobante);


// Consultar comprobante de un producto
router.get('/:productoId', consultarComprobante);


module.exports = router;