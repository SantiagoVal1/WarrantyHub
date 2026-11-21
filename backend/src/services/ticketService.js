
const pool = require('../config/database');

// Crear ticket de reclamo
const crearTicket = async (
    productoId,
    descripcion,
    usuarioId,
    rol
) => {
    const producto = await pool.query(
        `SELECT id, usuario_id
         FROM productos
         WHERE id = $1
         AND ($2 = 'administrador' OR usuario_id = $3)`,
        [productoId, rol, usuarioId]
    );

    if (producto.rows.length === 0) {
        return null;
    }

    const propietarioId = producto.rows[0].usuario_id;

    const resultado = await pool.query(
        `INSERT INTO tickets
        (producto_id, descripcion, usuario_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [productoId, descripcion, propietarioId]
    );

    return resultado.rows[0];
};

// Consultar tickets según el rol
const obtenerTickets = async (usuarioId, rol) => {
    const resultado = await pool.query(
        `SELECT
            t.id,
            t.producto_id,
            p.nombre AS producto,
            p.marca,
            p.modelo,
            t.usuario_id,
            u.nombre AS cliente,
            t.agente_id,
            a.nombre AS agente,
            t.descripcion,
            t.fecha_solicitud,
            t.estado
         FROM tickets t
         INNER JOIN productos p ON t.producto_id = p.id
         INNER JOIN usuarios u ON t.usuario_id = u.id
         LEFT JOIN usuarios a ON t.agente_id = a.id
         WHERE
            $2 = 'administrador'
            OR ($2 = 'agente' AND t.agente_id = $1)
            OR ($2 = 'cliente' AND t.usuario_id = $1)
         ORDER BY t.id`,
        [usuarioId, rol]
    );

    return resultado.rows;
};

// Actualizar estado del ticket
const actualizarEstadoTicket = async (
    id,
    estado,
    usuarioId,
    rol
) => {
    const resultado = await pool.query(
        `UPDATE tickets
         SET estado = $1
         WHERE id = $2
         AND (
            $4 = 'administrador'
            OR ($4 = 'agente' AND agente_id = $3)
         )
         RETURNING *`,
        [estado, id, usuarioId, rol]
    );

    return resultado.rows[0];
};

// Asignar un ticket a un agente
const asignarTicket = async (ticketId, agenteId) => {
    // Verificar que el usuario exista y tenga rol de agente
    const agente = await pool.query(
        `SELECT id
         FROM usuarios
         WHERE id = $1 AND rol = 'agente'`,
        [agenteId]
    );

    if (agente.rows.length === 0) {
        return { error: 'agente' };
    }

    // Asignar el agente al ticket
    const resultado = await pool.query(
        `UPDATE tickets
         SET agente_id = $1
         WHERE id = $2
         RETURNING *`,
        [agenteId, ticketId]
    );

    if (resultado.rows.length === 0) {
        return { error: 'ticket' };
    }

    return { ticket: resultado.rows[0] };
};

module.exports = {
    crearTicket,
    obtenerTickets,
    actualizarEstadoTicket,
    asignarTicket
};
