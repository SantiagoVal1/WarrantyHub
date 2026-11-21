
const express = require('express');

const router = express.Router();

const {
    registro,
    login,
    crearAgente,
    obtenerAgentes
} = require('../controllers/usuarioController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas: solo administrador
router.post(
    '/agentes',
    verificarToken,
    verificarRol('administrador'),
    crearAgente
);

router.get(
    '/agentes',
    verificarToken,
    verificarRol('administrador'),
    obtenerAgentes
);

module.exports = router;
