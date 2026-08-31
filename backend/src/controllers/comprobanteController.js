const {
    crearComprobante,
    obtenerComprobantePorProducto
} = require('../services/comprobanteService');


// Asociar comprobante a un producto
const registrarComprobante = async (req, res) => {
    try {

        const {
            productoId,
            nombreArchivo,
            rutaArchivo
        } = req.body;


        // Validar campos obligatorios
        if (
            !productoId ||
            !nombreArchivo ||
            !rutaArchivo
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }


        const comprobante = await crearComprobante(
            productoId,
            nombreArchivo,
            rutaArchivo
        );


        // Verificar si el producto existe
        if (!comprobante) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }


        res.status(201).json(comprobante);


    } catch (error) {

        console.error('Error al registrar comprobante:', error);

        res.status(500).json({
            mensaje: 'Error al registrar el comprobante'
        });
    }
};


// Consultar comprobante de un producto
const consultarComprobante = async (req, res) => {
    try {

        const { productoId } = req.params;

        const comprobante = await obtenerComprobantePorProducto(
            productoId
        );


        if (!comprobante) {
            return res.status(404).json({
                mensaje: 'No hay comprobante registrado para este producto'
            });
        }


        res.status(200).json(comprobante);


    } catch (error) {

        console.error('Error al consultar comprobante:', error);

        res.status(500).json({
            mensaje: 'Error al consultar el comprobante'
        });
    }
};


module.exports = {
    registrarComprobante,
    consultarComprobante
};