
const {
    crearTicket,
    obtenerTickets,
    actualizarEstadoTicket,
    asignarTicket
} = require('../services/ticketService');

// Crear ticket de reclamo
const registrarTicket = async (req, res) => {
    try {
        const { productoId, descripcion } = req.body;

        if (
            !productoId ||
            typeof descripcion !== 'string' ||
            !descripcion.trim()
        ) {
            return res.status(400).json({
                mensaje: 'El producto y la descripción son obligatorios'
            });
        }

        if (!Number.isInteger(Number(productoId)) || Number(productoId) <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del producto no es válido'
            });
        }

        const ticket = await crearTicket(
            Number(productoId),
            descripcion.trim(),
            req.usuario.id,
            req.usuario.rol
        );

        if (!ticket) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado o no tienes permiso para utilizarlo'
            });
        }

        return res.status(201).json(ticket);

    } catch (error) {
        console.error('Error al registrar ticket:', error);

        return res.status(500).json({
            mensaje: 'Error al registrar el ticket'
        });
    }
};

// Consultar tickets según el rol
const listarTickets = async (req, res) => {
    try {
        const tickets = await obtenerTickets(
            req.usuario.id,
            req.usuario.rol
        );

        return res.status(200).json(tickets);

    } catch (error) {
        console.error('Error al consultar tickets:', error);

        return res.status(500).json({
            mensaje: 'Error al obtener los tickets'
        });
    }
};

// Actualizar estado del ticket
const editarEstadoTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensaje: 'ID de ticket no válido'
            });
        }

        const estadosPermitidos = [
            'abierto',
            'en proceso',
            'cerrado'
        ];

        if (!estado || !estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado no válido. Use: abierto, en proceso o cerrado'
            });
        }

        const ticket = await actualizarEstadoTicket(
            id,
            estado,
            req.usuario.id,
            req.usuario.rol
        );

        if (!ticket) {
            return res.status(404).json({
                mensaje: 'Ticket no encontrado o no tienes permiso para modificarlo'
            });
        }

        return res.status(200).json(ticket);

    } catch (error) {
        console.error('Error al actualizar ticket:', error);

        return res.status(500).json({
            mensaje: 'Error al actualizar el ticket'
        });
    }
};

// Asignar ticket a un agente
const asignarTicketAAgente = async (req, res) => {
    try {
        const { id } = req.params;
        const { agenteId } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensaje: 'ID de ticket no válido'
            });
        }

        if (
            !Number.isInteger(Number(agenteId)) ||
            Number(agenteId) <= 0
        ) {
            return res.status(400).json({
                mensaje: 'El ID del agente no es válido'
            });
        }

        const resultado = await asignarTicket(
            Number(id),
            Number(agenteId)
        );

        if (resultado.error === 'agente') {
            return res.status(404).json({
                mensaje: 'El agente no existe o no tiene el rol de agente'
            });
        }

        if (resultado.error === 'ticket') {
            return res.status(404).json({
                mensaje: 'El ticket no existe'
            });
        }

        return res.status(200).json({
            mensaje: 'Ticket asignado correctamente',
            ticket: resultado.ticket
        });

    } catch (error) {
        console.error('Error al asignar ticket:', error);

        return res.status(500).json({
            mensaje: 'Error al asignar el ticket'
        });
    }
};

module.exports = {
    registrarTicket,
    listarTickets,
    editarEstadoTicket,
    asignarTicketAAgente
};
