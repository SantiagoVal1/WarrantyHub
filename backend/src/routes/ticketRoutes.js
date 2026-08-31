const express = require('express');

const {
    registrarTicket,
    listarTickets,
    editarEstadoTicket
} = require('../controllers/ticketController');

const router = express.Router();


// Crear ticket
router.post('/', registrarTicket);


// Consultar tickets
router.get('/', listarTickets);


// Actualizar estado del ticket
router.put('/:id', editarEstadoTicket);


module.exports = router;