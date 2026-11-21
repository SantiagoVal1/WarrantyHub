
const express = require('express');

const router = express.Router();

const {
    registrarTicket,
    listarTickets,
    editarEstadoTicket,
    asignarTicketAAgente
} = require('../controllers/ticketController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Crear tickets
router.post(
    '/',
    verificarRol('administrador', 'cliente'),
    registrarTicket
);

// Consultar tickets
router.get(
    '/',
    verificarRol('administrador', 'agente', 'cliente'),
    listarTickets
);

// Actualizar estado
router.put(
    '/:id',
    verificarRol('administrador', 'agente'),
    editarEstadoTicket
);

// Asignar ticket: solamente administrador
router.put(
    '/:id/asignar',
    verificarRol('administrador'),
    asignarTicketAAgente
);

module.exports = router;
