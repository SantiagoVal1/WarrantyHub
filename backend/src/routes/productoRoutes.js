
const express = require('express');

const router = express.Router();

const {
    listarProductos,
    registrarProducto,
    editarProducto
} = require('../controllers/productoController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Consultar productos
router.get(
    '/',
    verificarRol('administrador', 'cliente'),
    listarProductos
);

// Registrar productos
router.post(
    '/',
    verificarRol('administrador', 'cliente'),
    registrarProducto
);

// Editar productos
router.put(
    '/:id',
    verificarRol('administrador', 'cliente'),
    editarProducto
);

module.exports = router;
