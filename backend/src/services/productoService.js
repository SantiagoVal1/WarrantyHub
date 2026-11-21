
const pool = require('../config/database');

// Obtener productos según el usuario autenticado
const obtenerProductos = async (usuarioId, rol) => {
    const resultado = await pool.query(
        `SELECT *
         FROM productos
         WHERE ($1 = 'administrador' OR usuario_id = $2)
         ORDER BY id`,
        [rol, usuarioId]
    );

    const productos = resultado.rows.map(producto => {
        const hoy = new Date();
        const fechaFinGarantia = new Date(producto.fecha_fin_garantia);

        return {
            ...producto,
            garantiaActiva: fechaFinGarantia >= hoy
        };
    });

    return productos;
};

// Crear producto
const crearProducto = async (
    nombre,
    marca,
    modelo,
    numeroSerie,
    fechaCompra,
    fechaFinGarantia,
    usuarioId
) => {
    // Verificar que el propietario exista y sea cliente
    const usuario = await pool.query(
        `SELECT id
         FROM usuarios
         WHERE id = $1
         AND rol = 'cliente'`,
        [usuarioId]
    );

    if (usuario.rows.length === 0) {
        return null;
    }

    const resultado = await pool.query(
        `INSERT INTO productos
        (nombre, marca, modelo, numero_serie,
         fecha_compra, fecha_fin_garantia, usuario_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia,
            usuarioId
        ]
    );

    return resultado.rows[0];
};

// Actualizar producto
const actualizarProducto = async (
    id,
    nombre,
    marca,
    modelo,
    numeroSerie,
    fechaCompra,
    fechaFinGarantia,
    usuarioId,
    rol
) => {
    const resultado = await pool.query(
        `UPDATE productos
         SET nombre = $1,
             marca = $2,
             modelo = $3,
             numero_serie = $4,
             fecha_compra = $5,
             fecha_fin_garantia = $6
         WHERE id = $7
         AND ($8 = 'administrador' OR usuario_id = $9)
         RETURNING *`,
        [
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia,
            id,
            rol,
            usuarioId
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto
};
