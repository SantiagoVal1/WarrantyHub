
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
    registrarUsuario,
    buscarUsuarioPorCorreo,
    registrarAgente,
    listarAgentes
} = require('../services/usuarioService');

// Registrar un cliente
const registro = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (
            typeof nombre !== 'string' ||
            typeof correo !== 'string' ||
            typeof password !== 'string' ||
            nombre.trim() === '' ||
            correo.trim() === ''
        ) {
            return res.status(400).json({
                mensaje: 'Los datos proporcionados no son válidos'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener mínimo 8 caracteres'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const usuarioExistente = await buscarUsuarioPorCorreo(correoNormalizado);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'Este correo ya está registrado'
            });
        }

        const usuario = await registrarUsuario(
            nombre.trim(),
            correoNormalizado,
            password
        );

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario,
            token
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'Este correo ya está registrado'
            });
        }

        return res.status(500).json({
            mensaje: 'Error interno al registrar el usuario'
        });
    }
};

// Iniciar sesión
const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (
            typeof correo !== 'string' ||
            typeof password !== 'string' ||
            !correo.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: 'El correo y la contraseña son obligatorios'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const usuario = await buscarUsuarioPorCorreo(correoNormalizado);

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            },
            token
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            mensaje: 'Error interno al iniciar sesión'
        });
    }
};

// Crear un agente
const crearAgente = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (
            typeof nombre !== 'string' ||
            typeof correo !== 'string' ||
            typeof password !== 'string' ||
            !nombre.trim() ||
            !correo.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener mínimo 8 caracteres'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const usuarioExistente = await buscarUsuarioPorCorreo(correoNormalizado);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'Este correo ya está registrado'
            });
        }

        const agente = await registrarAgente(
            nombre.trim(),
            correoNormalizado,
            password
        );

        return res.status(201).json({
            mensaje: 'Agente creado correctamente',
            agente
        });

    } catch (error) {
        console.error('Error al crear agente:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'Este correo ya está registrado'
            });
        }

        return res.status(500).json({
            mensaje: 'Error interno al crear el agente'
        });
    }
};

// Consultar agentes
const obtenerAgentes = async (req, res) => {
    try {
        const agentes = await listarAgentes();

        return res.status(200).json(agentes);

    } catch (error) {
        console.error('Error al consultar agentes:', error);

        return res.status(500).json({
            mensaje: 'Error al obtener los agentes'
        });
    }
};

module.exports = {
    registro,
    login,
    crearAgente,
    obtenerAgentes
};
