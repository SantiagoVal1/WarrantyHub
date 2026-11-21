
const {
    obtenerProductos,
    crearProducto,
    actualizarProducto
} = require('../services/productoService');

// Consultar productos
const listarProductos = async (req, res) => {
    try {
        const productos = await obtenerProductos(
            req.usuario.id,
            req.usuario.rol
        );

        return res.status(200).json(productos);

    } catch (error) {
        console.error('Error al listar productos:', error);

        return res.status(500).json({
            mensaje: 'Error al obtener los productos'
        });
    }
};

// Registrar producto
const registrarProducto = async (req, res) => {
    try {
        const {
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia
        } = req.body;

        if (
            !nombre ||
            !marca ||
            !modelo ||
            !numeroSerie ||
            !fechaCompra ||
            !fechaFinGarantia
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const fechaInicio = new Date(fechaCompra);
        const fechaFin = new Date(fechaFinGarantia);

        if (
            isNaN(fechaInicio.getTime()) ||
            isNaN(fechaFin.getTime()) ||
            fechaFin < fechaInicio
        ) {
            return res.status(400).json({
                mensaje: 'Las fechas no son válidas o la garantía termina antes de la compra'
            });
        }

        // El administrador indica el cliente propietario.
        // El cliente siempre queda asociado a su propia cuenta.
        let propietarioId;

        if (req.usuario.rol === 'administrador') {
            propietarioId = req.body.usuarioId;

            if (!Number.isInteger(Number(propietarioId)) ||
                Number(propietarioId) <= 0) {
                return res.status(400).json({
                    mensaje: 'Debes indicar un ID de cliente válido'
                });
            }

            propietarioId = Number(propietarioId);
        } else {
            propietarioId = req.usuario.id;
        }

        const producto = await crearProducto(
            nombre.trim(),
            marca.trim(),
            modelo.trim(),
            numeroSerie.trim(),
            fechaCompra,
            fechaFinGarantia,
            propietarioId
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: 'El cliente indicado no existe o no es un cliente válido'
            });
        }

        return res.status(201).json(producto);

    } catch (error) {
        console.error('Error al registrar producto:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'El número de serie ya está registrado'
            });
        }

        return res.status(500).json({
            mensaje: 'Error al registrar el producto'
        });
    }
};

// Editar producto
const editarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensaje: 'ID de producto no válido'
            });
        }

        const {
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia
        } = req.body;

        if (
            !nombre ||
            !marca ||
            !modelo ||
            !numeroSerie ||
            !fechaCompra ||
            !fechaFinGarantia
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const fechaInicio = new Date(fechaCompra);
        const fechaFin = new Date(fechaFinGarantia);

        if (
            isNaN(fechaInicio.getTime()) ||
            isNaN(fechaFin.getTime()) ||
            fechaFin < fechaInicio
        ) {
            return res.status(400).json({
                mensaje: 'Las fechas no son válidas o la garantía termina antes de la compra'
            });
        }

        const producto = await actualizarProducto(
            id,
            nombre.trim(),
            marca.trim(),
            modelo.trim(),
            numeroSerie.trim(),
            fechaCompra,
            fechaFinGarantia,
            req.usuario.id,
            req.usuario.rol
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado o no tienes permiso para modificarlo'
            });
        }

        return res.status(200).json(producto);

    } catch (error) {
        console.error('Error al editar producto:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'El número de serie ya está registrado'
            });
        }

        return res.status(500).json({
            mensaje: 'Error al editar el producto'
        });
    }
};

module.exports = {
    listarProductos,
    registrarProducto,
    editarProducto
};
