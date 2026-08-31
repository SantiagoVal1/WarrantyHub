const {
    crearTicket,
    obtenerTickets,
    actualizarEstadoTicket
} = require('../services/ticketService');


// Crear ticket de reclamo
const registrarTicket = async (req, res) => {
    try {

        const {
            productoId,
            descripcion
        } = req.body;


        // Validar campos obligatorios
        if (!productoId || !descripcion) {
            return res.status(400).json({
                mensaje: 'El producto y la descripción son obligatorios'
            });
        }


        const ticket = await crearTicket(
            productoId,
            descripcion
        );


        // Verificar si el producto existe
        if (!ticket) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }


        res.status(201).json(ticket);


    } catch (error) {

        console.error('Error al registrar ticket:', error);

        res.status(500).json({
            mensaje: 'Error al registrar el ticket'
        });
    }
};


// Consultar todos los tickets
const listarTickets = async (req, res) => {
    try {

        const tickets = await obtenerTickets();

        res.status(200).json(tickets);


    } catch (error) {

        console.error('Error al consultar tickets:', error);

        res.status(500).json({
            mensaje: 'Error al obtener los tickets'
        });
    }
};


// Actualizar estado del ticket
const editarEstadoTicket = async (req, res) => {
    try {

        const { id } = req.params;
        const { estado } = req.body;


        // Validar estado
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
            estado
        );


        // Verificar si existe
        if (!ticket) {
            return res.status(404).json({
                mensaje: 'Ticket no encontrado'
            });
        }


        res.status(200).json(ticket);


    } catch (error) {

        console.error('Error al actualizar ticket:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar el ticket'
        });
    }
};


module.exports = {
    registrarTicket,
    listarTickets,
    editarEstadoTicket
};