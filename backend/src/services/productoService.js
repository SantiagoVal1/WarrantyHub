const pool = require('../config/database');


const obtenerProductos = async () => {
    const resultado = await pool.query(
        'SELECT * FROM productos ORDER BY id'
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


const crearProducto = async (
    nombre,
    marca,
    modelo,
    numeroSerie,
    fechaCompra,
    fechaFinGarantia
) => {

    const resultado = await pool.query(
        `INSERT INTO productos
        (nombre, marca, modelo, numero_serie, fecha_compra, fecha_fin_garantia)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia
        ]
    );

    return resultado.rows[0];
};


const actualizarProducto = async (
    id,
    nombre,
    marca,
    modelo,
    numeroSerie,
    fechaCompra,
    fechaFinGarantia
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
        RETURNING *`,
        [
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia,
            id
        ]
    );

    return resultado.rows[0];
};


module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto
};