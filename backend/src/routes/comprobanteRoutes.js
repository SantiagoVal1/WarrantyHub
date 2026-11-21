
const express = require('express');

const router = express.Router();

const {
    registrarComprobante,
    consultarComprobante
} = require('../controllers/comprobanteController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Registrar comprobantes
router.post(
    '/',
    verificarRol('administrador', 'cliente'),
    registrarComprobante
);

// Consultar comprobantes
router.get(
    '/:productoId',
    verificarRol('administrador', 'cliente'),
    consultarComprobante
);

module.exports = router;
