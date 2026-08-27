const API_URL = 'http://localhost:3000/api/productos';


// ========================================
// VARIABLES DEL FORMULARIO
// ========================================

const formulario = document.getElementById('formProducto');
const tituloFormulario = document.getElementById('tituloFormulario');
const botonFormulario = document.getElementById('botonFormulario');
const botonCancelar = document.getElementById('botonCancelar');

let productoEditando = null;


// ========================================
// OBTENER PRODUCTOS
// ========================================

async function cargarProductos() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los productos');
        }

        const productos = await respuesta.json();

        mostrarProductos(productos);

    } catch (error) {

        console.error('Error:', error);

        document.getElementById('productos').innerHTML = `
            <p>No se pudieron cargar los productos.</p>
        `;
    }
}


// ========================================
// MOSTRAR PRODUCTOS
// ========================================

function mostrarProductos(productos) {

    const contenedor = document.getElementById('productos');

    const totalProductos = document.getElementById('totalProductos');

totalProductos.textContent =
    `Total de productos: ${productos.length}`;

    if (productos.length === 0) {

        contenedor.innerHTML = `
            <p>No hay productos registrados.</p>
        `;

        return;
    }

    contenedor.innerHTML = '';


    productos.forEach(producto => {

        const tarjeta = document.createElement('div');

        tarjeta.classList.add('producto');


        const estadoGarantia = producto.garantiaActiva
            ? 'Garantía activa'
            : 'Garantía vencida';


        const claseGarantia = producto.garantiaActiva
            ? 'garantia-activa'
            : 'garantia-vencida';


        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>

            <p>
                <strong>Marca:</strong>
                ${producto.marca}
            </p>

            <p>
                <strong>Modelo:</strong>
                ${producto.modelo}
            </p>

            <p>
                <strong>Número de serie:</strong>
                ${producto.numero_serie}
            </p>

            <p>
                <strong>Fecha de compra:</strong>
                ${producto.fecha_compra.substring(0, 10)}
            </p>

            <p>
                <strong>Fin de garantía:</strong>
                ${producto.fecha_fin_garantia.substring(0, 10)}
            </p>

            <p class="${claseGarantia}">
                ${estadoGarantia}
            </p>

            <button onclick="editarProducto(${producto.id})">
                Editar
            </button>
        `;


        contenedor.appendChild(tarjeta);
    });
}


// ========================================
// REGISTRAR / ACTUALIZAR PRODUCTO
// ========================================

formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();


    const producto = {

        nombre: document.getElementById('nombre').value.trim(),

        marca: document.getElementById('marca').value.trim(),

        modelo: document.getElementById('modelo').value.trim(),

        numeroSerie: document.getElementById('numeroSerie').value.trim(),

        fechaCompra: document.getElementById('fechaCompra').value,

        fechaFinGarantia: document.getElementById('fechaFinGarantia').value

    };


    try {

        let respuesta;


        // ========================================
        // EDITAR PRODUCTO
        // ========================================

        if (productoEditando !== null) {

            respuesta = await fetch(
                `${API_URL}/${productoEditando}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(producto)
                }
            );

        }


        // ========================================
        // REGISTRAR PRODUCTO
        // ========================================

        else {

            respuesta = await fetch(
                API_URL,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(producto)
                }
            );

        }


        const datos = await respuesta.json();


        // ========================================
        // ERROR DEL BACKEND
        // ========================================

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;
        }


        // ========================================
        // MENSAJE DE ÉXITO
        // ========================================

        if (productoEditando !== null) {

            alert('Producto actualizado correctamente');

        } else {

            alert('Producto registrado correctamente');

        }


        // ========================================
        // RESTABLECER FORMULARIO
        // ========================================

        cancelarEdicion();


        // Volver a cargar productos
        cargarProductos();


    } catch (error) {

        console.error('Error:', error);

        alert('No se pudo conectar con el servidor');

    }

});


// ========================================
// EDITAR PRODUCTO
// ========================================

async function editarProducto(id) {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los productos');
        }

        const productos = await respuesta.json();


        const producto = productos.find(
            producto => producto.id === id
        );


        if (!producto) {

            alert('Producto no encontrado');

            return;
        }


        // Guardar el ID que estamos editando
        productoEditando = id;


        // ========================================
        // CARGAR DATOS EN EL FORMULARIO
        // ========================================

        document.getElementById('nombre').value =
            producto.nombre;

        document.getElementById('marca').value =
            producto.marca;

        document.getElementById('modelo').value =
            producto.modelo;

        document.getElementById('numeroSerie').value =
            producto.numero_serie;

        document.getElementById('fechaCompra').value =
            producto.fecha_compra.substring(0, 10);

        document.getElementById('fechaFinGarantia').value =
            producto.fecha_fin_garantia.substring(0, 10);


        // ========================================
        // CAMBIAR FORMULARIO A MODO EDICIÓN
        // ========================================

        tituloFormulario.textContent = 'Editar producto';

        botonFormulario.textContent = 'Actualizar producto';

        botonCancelar.style.display = 'block';


        // Subir al formulario
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });


    } catch (error) {

        console.error('Error al editar:', error);

        alert('No se pudo cargar el producto');

    }
}


// ========================================
// CANCELAR EDICIÓN
// ========================================

function cancelarEdicion() {

    productoEditando = null;

    formulario.reset();

    tituloFormulario.textContent = 'Registrar producto';

    botonFormulario.textContent = 'Guardar producto';

    botonCancelar.style.display = 'none';
}


botonCancelar.addEventListener(
    'click',
    cancelarEdicion
);


// ========================================
// INICIAR APLICACIÓN
// ========================================

cargarProductos();