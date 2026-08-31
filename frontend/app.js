const API_PRODUCTOS = 'http://localhost:3000/api/productos';
const API_COMPROBANTES = 'http://localhost:3000/api/comprobantes';
const API_TICKETS = 'http://localhost:3000/api/tickets';


// ========================================
// MODAL
// ========================================

const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modalTitulo');
const modalMensaje = document.getElementById('modalMensaje');
const modalBoton = document.getElementById('modalBoton');


// Mostrar modal
function mostrarModal(mensaje, titulo = 'WarrantyHub') {

    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;

    modal.classList.add('mostrar');

}


// Cerrar modal
function cerrarModal() {

    modal.classList.remove('mostrar');

}


modalBoton.addEventListener(
    'click',
    cerrarModal
);


// Cerrar al hacer clic fuera de la ventana
modal.addEventListener(
    'click',
    (evento) => {

        if (evento.target === modal) {
            cerrarModal();
        }

    }
);


// ========================================
// VARIABLES DEL FORMULARIO DE PRODUCTOS
// ========================================

const formulario =
    document.getElementById('formProducto');

const tituloFormulario =
    document.getElementById('tituloFormulario');

const botonFormulario =
    document.getElementById('botonFormulario');

const botonCancelar =
    document.getElementById('botonCancelar');

let productoEditando = null;


// ========================================
// OBTENER PRODUCTOS
// ========================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch(API_PRODUCTOS);


        if (!respuesta.ok) {
            throw new Error(
                'No se pudieron obtener los productos'
            );
        }


        const productos =
            await respuesta.json();


        mostrarProductos(productos);
        cargarProductosSelect(productos);


    } catch (error) {

        console.error('Error:', error);


        document.getElementById(
            'productos'
        ).innerHTML = `
            <p>
                No se pudieron cargar los productos.
            </p>
        `;

    }

}


// ========================================
// MOSTRAR PRODUCTOS
// ========================================

function mostrarProductos(productos) {

    const contenedor =
        document.getElementById('productos');

    const totalProductos =
        document.getElementById('totalProductos');


    totalProductos.textContent =
        `Total de productos: ${productos.length}`;


    if (productos.length === 0) {

        contenedor.innerHTML = `
            <p>
                No hay productos registrados.
            </p>
        `;

        return;

    }


    contenedor.innerHTML = '';


    productos.forEach(producto => {

        const tarjeta =
            document.createElement('div');


        tarjeta.classList.add('producto');


        const estadoGarantia =
            producto.garantiaActiva
                ? 'Garantía activa'
                : 'Garantía vencida';


        const claseGarantia =
            producto.garantiaActiva
                ? 'garantia-activa'
                : 'garantia-vencida';


        tarjeta.innerHTML = `

            <h3>
                ${producto.nombre}
            </h3>

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

            <button
                onclick="editarProducto(${producto.id})"
            >
                Editar
            </button>

            <button
                onclick="consultarComprobante(${producto.id})"
            >
                Ver comprobante
            </button>

        `;


        contenedor.appendChild(tarjeta);

    });

}


// ========================================
// CARGAR PRODUCTOS EN LOS SELECT
// ========================================

function cargarProductosSelect(productos) {

    const selectComprobante =
        document.getElementById(
            'productoComprobante'
        );

    const selectTicket =
        document.getElementById(
            'productoTicket'
        );


    selectComprobante.innerHTML = `
        <option value="">
            Seleccione un producto
        </option>
    `;


    selectTicket.innerHTML = `
        <option value="">
            Seleccione un producto
        </option>
    `;


    productos.forEach(producto => {

        const opcionComprobante =
            document.createElement('option');


        opcionComprobante.value =
            producto.id;


        opcionComprobante.textContent =
            `${producto.nombre} - ${producto.numero_serie}`;


        selectComprobante.appendChild(
            opcionComprobante
        );


        const opcionTicket =
            document.createElement('option');


        opcionTicket.value =
            producto.id;


        opcionTicket.textContent =
            `${producto.nombre} - ${producto.numero_serie}`;


        selectTicket.appendChild(
            opcionTicket
        );

    });

}


// ========================================
// REGISTRAR / ACTUALIZAR PRODUCTO
// ========================================

formulario.addEventListener(
    'submit',
    async (evento) => {

        evento.preventDefault();


        const producto = {

            nombre:
                document.getElementById(
                    'nombre'
                ).value.trim(),

            marca:
                document.getElementById(
                    'marca'
                ).value.trim(),

            modelo:
                document.getElementById(
                    'modelo'
                ).value.trim(),

            numeroSerie:
                document.getElementById(
                    'numeroSerie'
                ).value.trim(),

            fechaCompra:
                document.getElementById(
                    'fechaCompra'
                ).value,

            fechaFinGarantia:
                document.getElementById(
                    'fechaFinGarantia'
                ).value

        };


        try {

            let respuesta;


            // EDITAR PRODUCTO

            if (productoEditando !== null) {

                respuesta =
                    await fetch(
                        `${API_PRODUCTOS}/${productoEditando}`,
                        {
                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(producto)
                        }
                    );

            }


            // REGISTRAR PRODUCTO

            else {

                respuesta =
                    await fetch(
                        API_PRODUCTOS,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(producto)
                        }
                    );

            }


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                mostrarModal(
                    datos.mensaje,
                    'Error'
                );

                return;

            }


            if (productoEditando !== null) {

                mostrarModal(
                    'Producto actualizado correctamente'
                );

            } else {

                mostrarModal(
                    'Producto registrado correctamente'
                );

            }


            cancelarEdicion();

            cargarProductos();


        } catch (error) {

            console.error('Error:', error);


            mostrarModal(
                'No se pudo conectar con el servidor',
                'Error'
            );

        }

    }
);


// ========================================
// EDITAR PRODUCTO
// ========================================

async function editarProducto(id) {

    try {

        const respuesta =
            await fetch(API_PRODUCTOS);


        if (!respuesta.ok) {

            throw new Error(
                'No se pudieron obtener los productos'
            );

        }


        const productos =
            await respuesta.json();


        const producto =
            productos.find(
                producto => producto.id === id
            );


        if (!producto) {

            mostrarModal(
                'Producto no encontrado',
                'Error'
            );

            return;

        }


        productoEditando = id;


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


        tituloFormulario.textContent =
            'Editar producto';


        botonFormulario.textContent =
            'Actualizar producto';


        botonCancelar.style.display =
            'block';


        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });


    } catch (error) {

        console.error(
            'Error al editar:',
            error
        );


        mostrarModal(
            'No se pudo cargar el producto',
            'Error'
        );

    }

}


// ========================================
// CANCELAR EDICIÓN
// ========================================

function cancelarEdicion() {

    productoEditando = null;

    formulario.reset();


    tituloFormulario.textContent =
        'Registrar producto';


    botonFormulario.textContent =
        'Guardar producto';


    botonCancelar.style.display =
        'none';

}


botonCancelar.addEventListener(
    'click',
    cancelarEdicion
);


// ========================================
// ASOCIAR COMPROBANTE
// ========================================

const formComprobante =
    document.getElementById(
        'formComprobante'
    );


formComprobante.addEventListener(
    'submit',
    async (evento) => {

        evento.preventDefault();


        const productoId =
            document.getElementById(
                'productoComprobante'
            ).value;


        const nombreArchivo =
            document.getElementById(
                'nombreArchivo'
            ).value.trim();


        const rutaArchivo =
            document.getElementById(
                'rutaArchivo'
            ).value.trim();


        try {

            const respuesta =
                await fetch(
                    API_COMPROBANTES,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            productoId:
                                Number(productoId),

                            nombreArchivo:
                                nombreArchivo,

                            rutaArchivo:
                                rutaArchivo

                        })
                    }
                );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                mostrarModal(
                    datos.mensaje,
                    'Error'
                );

                return;

            }


            mostrarModal(
                'Comprobante asociado correctamente'
            );


            formComprobante.reset();


        } catch (error) {

            console.error(
                'Error al asociar comprobante:',
                error
            );


            mostrarModal(
                'No se pudo conectar con el servidor',
                'Error'
            );

        }

    }
);


// ========================================
// CONSULTAR COMPROBANTE
// ========================================

async function consultarComprobante(
    productoId
) {

    try {

        const respuesta =
            await fetch(
                `${API_COMPROBANTES}/${productoId}`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mostrarModal(
                datos.mensaje,
                'Comprobante'
            );

            return;

        }


        mostrarModal(
            `Archivo: ${datos.nombre_archivo}
Ruta: ${datos.ruta_archivo}`,
            'Comprobante de compra'
        );


    } catch (error) {

        console.error(
            'Error al consultar comprobante:',
            error
        );


        mostrarModal(
            'No se pudo consultar el comprobante',
            'Error'
        );

    }

}


// ========================================
// CREAR TICKET
// ========================================

const formTicket =
    document.getElementById(
        'formTicket'
    );


formTicket.addEventListener(
    'submit',
    async (evento) => {

        evento.preventDefault();


        const productoId =
            document.getElementById(
                'productoTicket'
            ).value;


        const descripcion =
            document.getElementById(
                'descripcionTicket'
            ).value.trim();


        try {

            const respuesta =
                await fetch(
                    API_TICKETS,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            productoId:
                                Number(productoId),

                            descripcion:
                                descripcion

                        })
                    }
                );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                mostrarModal(
                    datos.mensaje,
                    'Error'
                );

                return;

            }


            mostrarModal(
                'Ticket creado correctamente'
            );


            formTicket.reset();

            cargarTickets();


        } catch (error) {

            console.error(
                'Error al crear ticket:',
                error
            );


            mostrarModal(
                'No se pudo conectar con el servidor',
                'Error'
            );

        }

    }
);


// ========================================
// CARGAR TICKETS
// ========================================

async function cargarTickets() {

    const contenedor =
        document.getElementById(
            'tickets'
        );


    try {

        const respuesta =
            await fetch(API_TICKETS);


        if (!respuesta.ok) {

            throw new Error(
                'No se pudieron obtener los tickets'
            );

        }


        const tickets =
            await respuesta.json();


        mostrarTickets(tickets);


    } catch (error) {

        console.error(
            'Error al cargar tickets:',
            error
        );


        contenedor.innerHTML = `
            <p>
                No se pudieron cargar los tickets.
            </p>
        `;

    }

}


// ========================================
// MOSTRAR TICKETS
// ========================================

function mostrarTickets(tickets) {

    const contenedor =
        document.getElementById(
            'tickets'
        );


    if (tickets.length === 0) {

        contenedor.innerHTML = `
            <p>
                No hay tickets registrados.
            </p>
        `;

        return;

    }


    contenedor.innerHTML = '';


    tickets.forEach(ticket => {

        const tarjeta =
            document.createElement('div');


        tarjeta.classList.add('producto');


        tarjeta.innerHTML = `

            <h3>
                Ticket #${ticket.id}
            </h3>

            <p>
                <strong>Producto:</strong>
                ${ticket.producto}
            </p>

            <p>
                <strong>Marca:</strong>
                ${ticket.marca}
            </p>

            <p>
                <strong>Modelo:</strong>
                ${ticket.modelo}
            </p>

            <p>
                <strong>Descripción:</strong>
                ${ticket.descripcion}
            </p>

            <p>
                <strong>Fecha:</strong>
                ${ticket.fecha_solicitud.substring(0, 10)}
            </p>

            <p>
                <strong>Estado:</strong>
                ${ticket.estado}
            </p>

            <select
                onchange="
                    actualizarEstadoTicket(
                        ${ticket.id},
                        this.value
                    )
                "
            >

                <option
                    value="abierto"
                    ${ticket.estado === 'abierto'
                        ? 'selected'
                        : ''}
                >
                    Abierto
                </option>

                <option
                    value="en proceso"
                    ${ticket.estado === 'en proceso'
                        ? 'selected'
                        : ''}
                >
                    En proceso
                </option>

                <option
                    value="cerrado"
                    ${ticket.estado === 'cerrado'
                        ? 'selected'
                        : ''}
                >
                    Cerrado
                </option>

            </select>

        `;


        contenedor.appendChild(tarjeta);

    });

}


// ========================================
// ACTUALIZAR ESTADO DEL TICKET
// ========================================

async function actualizarEstadoTicket(
    id,
    estado
) {

    try {

        const respuesta =
            await fetch(
                `${API_TICKETS}/${id}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        estado: estado
                    })
                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mostrarModal(
                datos.mensaje,
                'Error'
            );

            return;

        }


        mostrarModal(
            'Estado del ticket actualizado correctamente'
        );


        cargarTickets();


    } catch (error) {

        console.error(
            'Error al actualizar ticket:',
            error
        );


        mostrarModal(
            'No se pudo actualizar el ticket',
            'Error'
        );

    }

}


// ========================================
// INICIAR APLICACIÓN
// ========================================

cargarProductos();
cargarTickets();