const pool = require('../config/database');


// Crear ticket de reclamo
const crearTicket = async (
    productoId,
    descripcion
) => {

    // Verificar que el producto exista
    const producto = await pool.query(
        'SELECT id FROM productos WHERE id = $1',
        [productoId]
    );

    if (producto.rows.length === 0) {
        return null;
    }

    const resultado = await pool.query(
        `INSERT INTO tickets
        (producto_id, descripcion)
        VALUES ($1, $2)
        RETURNING *`,
        [
            productoId,
            descripcion
        ]
    );

    return resultado.rows[0];
};


// Consultar todos los tickets
const obtenerTickets = async () => {

    const resultado = await pool.query(
        `SELECT
            t.id,
            t.producto_id,
            p.nombre AS producto,
            p.marca,
            p.modelo,
            t.descripcion,
            t.fecha_solicitud,
            t.estado
         FROM tickets t
         INNER JOIN productos p
         ON t.producto_id = p.id
         ORDER BY t.id`
    );

    return resultado.rows;
};


// Actualizar estado del ticket
const actualizarEstadoTicket = async (
    id,
    estado
) => {

    const resultado = await pool.query(
        `UPDATE tickets
         SET estado = $1
         WHERE id = $2
         RETURNING *`,
        [
            estado,
            id
        ]
    );

    return resultado.rows[0];
};


module.exports = {
    crearTicket,
    obtenerTickets,
    actualizarEstadoTicket
};