const express = require('express');

const router = express.Router();

const {
    listarProductos,
    registrarProducto,
    editarProducto
} = require('../controllers/productoController');


// Obtener todos los productos
router.get('/', listarProductos);

// Registrar un producto
router.post('/', registrarProducto);

// Editar un producto
router.put('/:id', editarProducto);


module.exports = router;