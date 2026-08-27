const {
    obtenerProductos,
    crearProducto,
    actualizarProducto
} = require('../services/productoService');


// Obtener todos los productos
const listarProductos = async (req, res) => {
    try {
        const productos = await obtenerProductos();

        res.status(200).json(productos);

    } catch (error) {
        console.error('Error al listar productos:', error);

        res.status(500).json({
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


        // Validar campos obligatorios
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


        // Validar fechas
        const fechaInicio = new Date(fechaCompra);
        const fechaFin = new Date(fechaFinGarantia);

        if (fechaFin < fechaInicio) {
            return res.status(400).json({
                mensaje: 'La fecha de fin de garantía no puede ser anterior a la fecha de compra'
            });
        }


        const producto = await crearProducto(
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia
        );


        res.status(201).json(producto);


    } catch (error) {

        console.error('Error al registrar producto:', error);


        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'El número de serie ya está registrado'
            });
        }


        res.status(500).json({
            mensaje: 'Error al registrar el producto'
        });
    }
};


// Editar producto
const editarProducto = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia
        } = req.body;


        // Validar campos obligatorios
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


        // Validar fechas
        const fechaInicio = new Date(fechaCompra);
        const fechaFin = new Date(fechaFinGarantia);

        if (fechaFin < fechaInicio) {
            return res.status(400).json({
                mensaje: 'La fecha de fin de garantía no puede ser anterior a la fecha de compra'
            });
        }


        const producto = await actualizarProducto(
            id,
            nombre,
            marca,
            modelo,
            numeroSerie,
            fechaCompra,
            fechaFinGarantia
        );


        // Verificar si existe
        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }


        res.status(200).json(producto);


    } catch (error) {

        console.error('Error al editar producto:', error);


        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'El número de serie ya está registrado'
            });
        }


        res.status(500).json({
            mensaje: 'Error al editar el producto'
        });
    }
};


// Exportar funciones
module.exports = {
    listarProductos,
    registrarProducto,
    editarProducto
};