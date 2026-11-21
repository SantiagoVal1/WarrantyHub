
const pool = require('../config/database');
const bcrypt = require('bcrypt');

// Registrar un cliente
const registrarUsuario = async (nombre, correo, password) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
        `INSERT INTO usuarios (nombre, correo, password, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nombre, correo, rol, fecha_registro`,
        [nombre, correo, passwordHash, 'cliente']
    );

    return resultado.rows[0];
};

// Buscar usuario por correo
const buscarUsuarioPorCorreo = async (correo) => {
    const resultado = await pool.query(
        `SELECT * FROM usuarios
         WHERE correo = $1`,
        [correo]
    );

    return resultado.rows[0];
};

// Registrar un agente
const registrarAgente = async (nombre, correo, password) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
        `INSERT INTO usuarios (nombre, correo, password, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nombre, correo, rol, fecha_registro`,
        [nombre, correo, passwordHash, 'agente']
    );

    return resultado.rows[0];
};

// Obtener todos los agentes
const listarAgentes = async () => {
    const resultado = await pool.query(
        `SELECT id, nombre, correo, rol, fecha_registro
         FROM usuarios
         WHERE rol = 'agente'
         ORDER BY nombre ASC`
    );

    return resultado.rows;
};

module.exports = {
    registrarUsuario,
    buscarUsuarioPorCorreo,
    registrarAgente,
    listarAgentes
};
