
const pool = require('../config/database');

// Asociar comprobante a un producto
const crearComprobante = async (
    productoId,
    nombreArchivo,
    rutaArchivo,
    usuarioId,
    rol
) => {
    // Verificar que el producto exista y pertenezca al usuario
    const producto = await pool.query(
        `SELECT id
         FROM productos
         WHERE id = $1
         AND ($2 = 'administrador' OR usuario_id = $3)`,
        [productoId, rol, usuarioId]
    );

    if (producto.rows.length === 0) {
        return null;
    }

    const resultado = await pool.query(
        `INSERT INTO comprobantes
        (producto_id, nombre_archivo, ruta_archivo)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [productoId, nombreArchivo, rutaArchivo]
    );

    return resultado.rows[0];
};

// Consultar comprobante de un producto
const obtenerComprobantePorProducto = async (
    productoId,
    usuarioId,
    rol
) => {
    const resultado = await pool.query(
        `SELECT c.*
         FROM comprobantes c
         INNER JOIN productos p ON c.producto_id = p.id
         WHERE c.producto_id = $1
         AND ($2 = 'administrador' OR p.usuario_id = $3)
         ORDER BY c.id DESC
         LIMIT 1`,
        [productoId, rol, usuarioId]
    );

    return resultado.rows[0];
};

module.exports = {
    crearComprobante,
    obtenerComprobantePorProducto
};
