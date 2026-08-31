const pool = require('../config/database');


// Asociar comprobante a un producto
const crearComprobante = async (
    productoId,
    nombreArchivo,
    rutaArchivo
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
        `INSERT INTO comprobantes
        (producto_id, nombre_archivo, ruta_archivo)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            productoId,
            nombreArchivo,
            rutaArchivo
        ]
    );

    return resultado.rows[0];
};


// Consultar comprobante de un producto
const obtenerComprobantePorProducto = async (productoId) => {

    const resultado = await pool.query(
        `SELECT *
         FROM comprobantes
         WHERE producto_id = $1
         ORDER BY id DESC
         LIMIT 1`,
        [productoId]
    );

    return resultado.rows[0];
};


module.exports = {
    crearComprobante,
    obtenerComprobantePorProducto
};