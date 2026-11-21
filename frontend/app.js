
const API_BASE = 'http://localhost:3000/api';

const API_USUARIOS = `${API_BASE}/usuarios`;
const API_PRODUCTOS = `${API_BASE}/productos`;
const API_COMPROBANTES = `${API_BASE}/comprobantes`;
const API_TICKETS = `${API_BASE}/tickets`;

// ========================================
// SESIÓN Y AUTENTICACIÓN
// ========================================

let token = localStorage.getItem('warrantyhub_token');

let usuarioActual = JSON.parse(
    localStorage.getItem('warrantyhub_usuario') || 'null'
);

let modoRegistro = false;
let productoEditando = null;
let agentesActuales = [];

const seccionAutenticacion = document.getElementById('seccionAutenticacion');
const panelPrincipal = document.getElementById('panelPrincipal');
const informacionUsuario = document.getElementById('informacionUsuario');

const formAutenticacion = document.getElementById('formAutenticacion');
const tituloAutenticacion = document.getElementById('tituloAutenticacion');
const campoNombre = document.getElementById('campoNombre');

const inputNombreUsuario = document.getElementById('nombreUsuario');
const inputCorreoUsuario = document.getElementById('correoUsuario');
const inputPasswordUsuario = document.getElementById('passwordUsuario');

const botonAutenticacion = document.getElementById('botonAutenticacion');
const cambiarModoAutenticacion = document.getElementById('cambiarModoAutenticacion');
const mensajeAutenticacion = document.getElementById('mensajeAutenticacion');

const botonCerrarSesion = document.getElementById('botonCerrarSesion');

// ========================================
// MODAL
// ========================================

const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modalTitulo');
const modalMensaje = document.getElementById('modalMensaje');
const modalBoton = document.getElementById('modalBoton');

function mostrarModal(mensaje, titulo = 'WarrantyHub') {
    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    modal.classList.add('mostrar');
}

function cerrarModal() {
    modal.classList.remove('mostrar');
}

modalBoton.addEventListener('click', cerrarModal);

modal.addEventListener('click', evento => {
    if (evento.target === modal) {
        cerrarModal();
    }
});

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caracter => {
        const caracteres = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return caracteres[caracter];
    });
}

function obtenerFecha(valor) {
    if (!valor) return 'No disponible';
    return String(valor).substring(0, 10);
}

function obtenerNombreRol(rol) {
    const roles = {
        administrador: 'Administrador',
        agente: 'Agente',
        cliente: 'Cliente'
    };

    return roles[rol] || rol;
}

function guardarSesion(datos) {
    token = datos.token;
    usuarioActual = datos.usuario;

    localStorage.setItem('warrantyhub_token', token);
    localStorage.setItem(
        'warrantyhub_usuario',
        JSON.stringify(usuarioActual)
    );
}

function eliminarSesion() {
    token = null;
    usuarioActual = null;
    agentesActuales = [];
    productoEditando = null;

    localStorage.removeItem('warrantyhub_token');
    localStorage.removeItem('warrantyhub_usuario');
}

function cerrarSesion() {
    eliminarSesion();

    panelPrincipal.style.display = 'none';
    informacionUsuario.style.display = 'none';
    seccionAutenticacion.style.display = 'block';

    formAutenticacion.reset();
    mensajeAutenticacion.textContent = '';

    cambiarModo(false);
}

function manejarSesionExpirada() {
    mostrarModal(
        'Tu sesión ha expirado. Inicia sesión nuevamente.',
        'Sesión finalizada'
    );

    cerrarSesion();
}

// ========================================
// PETICIONES AL BACKEND
// ========================================

async function peticionAPI(url, opciones = {}) {
    const headers = {
        ...(opciones.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const respuesta = await fetch(url, {
        ...opciones,
        headers
    });

    if (respuesta.status === 401 && token) {
        manejarSesionExpirada();
    }

    return respuesta;
}

async function leerRespuesta(respuesta) {
    const texto = await respuesta.text();

    if (!texto) return {};

    try {
        return JSON.parse(texto);
    } catch {
        return { mensaje: texto };
    }
}

// ========================================
// CAMBIAR ENTRE LOGIN Y REGISTRO
// ========================================

function cambiarModo(registro) {
    modoRegistro = registro;

    formAutenticacion.reset();
    mensajeAutenticacion.textContent = '';

    if (modoRegistro) {
        tituloAutenticacion.textContent = 'Crear cuenta';
        campoNombre.style.display = 'block';
        inputNombreUsuario.required = true;
        inputPasswordUsuario.autocomplete = 'new-password';

        botonAutenticacion.textContent = 'Registrarme';

        cambiarModoAutenticacion.textContent =
            '¿Ya tienes cuenta? Inicia sesión';

    } else {
        tituloAutenticacion.textContent = 'Iniciar sesión';
        campoNombre.style.display = 'none';
        inputNombreUsuario.required = false;
        inputPasswordUsuario.autocomplete = 'current-password';

        botonAutenticacion.textContent = 'Iniciar sesión';

        cambiarModoAutenticacion.textContent =
            '¿No tienes cuenta? Regístrate';
    }
}

cambiarModoAutenticacion.addEventListener('click', () => {
    cambiarModo(!modoRegistro);
});

// ========================================
// REGISTRO E INICIO DE SESIÓN
// ========================================

formAutenticacion.addEventListener('submit', async evento => {
    evento.preventDefault();

    const correo = inputCorreoUsuario.value.trim();
    const password = inputPasswordUsuario.value;
    const nombre = inputNombreUsuario.value.trim();

    if (modoRegistro && !nombre) {
        mensajeAutenticacion.textContent =
            'Debes ingresar tu nombre completo.';
        return;
    }

    if (modoRegistro && password.length < 8) {
        mensajeAutenticacion.textContent =
            'La contraseña debe tener al menos 8 caracteres.';
        return;
    }

    const botonTextoOriginal = botonAutenticacion.textContent;

    botonAutenticacion.disabled = true;
    botonAutenticacion.textContent = 'Procesando...';

    try {
        const endpoint = modoRegistro
            ? `${API_USUARIOS}/registro`
            : `${API_USUARIOS}/login`;

        const cuerpo = modoRegistro
            ? { nombre, correo, password }
            : { correo, password };

        const respuesta = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cuerpo)
        });

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mensajeAutenticacion.textContent =
                datos.mensaje || 'No se pudo completar la operación.';
            return;
        }

        if (!datos.token || !datos.usuario) {
            mensajeAutenticacion.textContent =
                'El servidor no devolvió los datos de sesión esperados.';
            return;
        }

        guardarSesion(datos);
        formAutenticacion.reset();

        mostrarPanel();

    } catch (error) {
        console.error('Error de autenticación:', error);

        mensajeAutenticacion.textContent =
            'No se pudo conectar con el servidor.';
    } finally {
        botonAutenticacion.disabled = false;
        botonAutenticacion.textContent = botonTextoOriginal;
    }
});

// ========================================
// MOSTRAR PANEL SEGÚN EL ROL
// ========================================

function mostrarPanel() {
    if (!usuarioActual || !token) {
        cerrarSesion();
        return;
    }

    seccionAutenticacion.style.display = 'none';
    panelPrincipal.style.display = 'block';
    informacionUsuario.style.display = 'block';

    document.getElementById('nombreUsuarioActivo').textContent =
        `Usuario: ${usuarioActual.nombre}`;

    document.getElementById('rolUsuarioActivo').textContent =
        `Rol: ${obtenerNombreRol(usuarioActual.rol)}`;

    configurarPermisosVisuales();
    cargarDatosIniciales();
}

function configurarPermisosVisuales() {
    const rol = usuarioActual.rol;

    const esAdministrador = rol === 'administrador';
    const esAgente = rol === 'agente';

    const seccionAgentes = document.getElementById('seccionAgentes');
    const seccionFormularioProducto =
        document.getElementById('seccionFormularioProducto');

    const seccionListaProductos =
        document.getElementById('seccionListaProductos');

    const seccionComprobantes =
        document.getElementById('seccionComprobantes');

    const seccionCrearTicket =
        document.getElementById('seccionCrearTicket');

    // Administración de agentes: solo administrador
    seccionAgentes.style.display =
        esAdministrador ? 'block' : 'none';

    // Los agentes trabajan únicamente con tickets
    seccionFormularioProducto.style.display =
        esAgente ? 'none' : 'block';

    seccionListaProductos.style.display =
        esAgente ? 'none' : 'block';

    seccionComprobantes.style.display =
        esAgente ? 'none' : 'block';

    seccionCrearTicket.style.display =
        esAgente ? 'none' : 'block';
}

// ========================================
// CARGAR INFORMACIÓN INICIAL
// ========================================

async function cargarDatosIniciales() {
    if (!token || !usuarioActual) return;

    if (usuarioActual.rol !== 'agente') {
        await cargarProductos();
    }

    if (usuarioActual.rol === 'administrador') {
        await cargarAgentes();
    }

    await cargarTickets();
}

botonCerrarSesion.addEventListener('click', cerrarSesion);

// ========================================
// VARIABLES DEL FORMULARIO DE PRODUCTOS
// ========================================

const formulario = document.getElementById('formProducto');

const tituloFormulario = document.getElementById('tituloFormulario');

const botonFormulario = document.getElementById('botonFormulario');

const botonCancelar = document.getElementById('botonCancelar');

// ========================================
// OBTENER PRODUCTOS
// ========================================

async function cargarProductos() {
    if (!token) return;

    try {
        const respuesta = await peticionAPI(API_PRODUCTOS);
        const productos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            throw new Error(
                productos.mensaje || 'No se pudieron obtener los productos'
            );
        }

        mostrarProductos(productos);
        cargarProductosSelect(productos);

    } catch (error) {
        console.error('Error al cargar productos:', error);

        document.getElementById('productos').textContent =
            'No se pudieron cargar los productos.';
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
        contenedor.textContent = 'No hay productos registrados.';
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
            <h3>${escaparHTML(producto.nombre)}</h3>

            <p><strong>Marca:</strong>
                ${escaparHTML(producto.marca)}
            </p>

            <p><strong>Modelo:</strong>
                ${escaparHTML(producto.modelo)}
            </p>

            <p><strong>Número de serie:</strong>
                ${escaparHTML(producto.numero_serie)}
            </p>

            <p><strong>Fecha de compra:</strong>
                ${escaparHTML(obtenerFecha(producto.fecha_compra))}
            </p>

            <p><strong>Fin de garantía:</strong>
                ${escaparHTML(obtenerFecha(producto.fecha_fin_garantia))}
            </p>

            <p class="${claseGarantia}">
                ${estadoGarantia}
            </p>

            <button type="button" class="boton-editar">
                Editar
            </button>

            <button type="button" class="boton-comprobante">
                Ver comprobante
            </button>
        `;

        tarjeta.querySelector('.boton-editar').addEventListener(
            'click',
            () => editarProducto(producto.id)
        );

        tarjeta.querySelector('.boton-comprobante').addEventListener(
            'click',
            () => consultarComprobante(producto.id)
        );

        contenedor.appendChild(tarjeta);
    });
}

// ========================================
// CARGAR PRODUCTOS EN LOS SELECT
// ========================================

function cargarProductosSelect(productos) {
    const selectComprobante =
        document.getElementById('productoComprobante');

    const selectTicket =
        document.getElementById('productoTicket');

    selectComprobante.innerHTML =
        '<option value="">Seleccione un producto</option>';

    selectTicket.innerHTML =
        '<option value="">Seleccione un producto</option>';

    productos.forEach(producto => {
        const texto =
            `${producto.nombre} - ${producto.numero_serie}`;

        const opcionComprobante = document.createElement('option');
        opcionComprobante.value = producto.id;
        opcionComprobante.textContent = texto;

        selectComprobante.appendChild(opcionComprobante);

        const opcionTicket = document.createElement('option');
        opcionTicket.value = producto.id;
        opcionTicket.textContent = texto;

        selectTicket.appendChild(opcionTicket);
    });
}

// ========================================
// REGISTRAR / ACTUALIZAR PRODUCTO
// ========================================

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();

    if (!token || !usuarioActual) return;

    const producto = {
        nombre: document.getElementById('nombre').value.trim(),
        marca: document.getElementById('marca').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        numeroSerie: document.getElementById('numeroSerie').value.trim(),
        fechaCompra: document.getElementById('fechaCompra').value,
        fechaFinGarantia: document.getElementById('fechaFinGarantia').value
    };

    if (producto.fechaFinGarantia < producto.fechaCompra) {
        mostrarModal(
            'La fecha de fin de garantía no puede ser anterior a la fecha de compra.',
            'Fecha incorrecta'
        );
        return;
    }

    try {
        let respuesta;

        if (productoEditando !== null) {
            respuesta = await peticionAPI(
                `${API_PRODUCTOS}/${productoEditando}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                }
            );

        } else {
            if (usuarioActual.rol === 'administrador') {
                const usuarioId = prompt(
                    'Ingresa el ID del cliente al que pertenece este producto:'
                );

                if (usuarioId === null) return;

                const idCliente = Number(usuarioId);

                if (!Number.isInteger(idCliente) || idCliente <= 0) {
                    mostrarModal(
                        'Debes ingresar un ID de cliente válido.',
                        'Error'
                    );
                    return;
                }

                producto.usuarioId = idCliente;
            }

            respuesta = await peticionAPI(
                API_PRODUCTOS,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                }
            );
        }

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarModal(
                datos.mensaje || 'No se pudo guardar el producto.',
                'Error'
            );
            return;
        }

        mostrarModal(
            productoEditando !== null
                ? 'Producto actualizado correctamente.'
                : 'Producto registrado correctamente.'
        );

        cancelarEdicion();
        await cargarProductos();

    } catch (error) {
        console.error('Error al guardar producto:', error);

        mostrarModal(
            'No se pudo conectar con el servidor.',
            'Error'
        );
    }
});

// ========================================
// EDITAR PRODUCTO
// ========================================

async function editarProducto(id) {
    try {
        const respuesta = await peticionAPI(API_PRODUCTOS);
        const productos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            throw new Error(
                productos.mensaje || 'No se pudieron obtener los productos'
            );
        }

        const producto = productos.find(
            elemento => Number(elemento.id) === Number(id)
        );

        if (!producto) {
            mostrarModal('Producto no encontrado.', 'Error');
            return;
        }

        productoEditando = id;

        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('marca').value = producto.marca;
        document.getElementById('modelo').value = producto.modelo;
        document.getElementById('numeroSerie').value =
            producto.numero_serie;

        document.getElementById('fechaCompra').value =
            obtenerFecha(producto.fecha_compra);

        document.getElementById('fechaFinGarantia').value =
            obtenerFecha(producto.fecha_fin_garantia);

        tituloFormulario.textContent = 'Editar producto';
        botonFormulario.textContent = 'Actualizar producto';
        botonCancelar.style.display = 'block';

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (error) {
        console.error('Error al editar producto:', error);

        mostrarModal(
            'No se pudo cargar el producto.',
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

    tituloFormulario.textContent = 'Registrar producto';
    botonFormulario.textContent = 'Guardar producto';
    botonCancelar.style.display = 'none';
}

botonCancelar.addEventListener('click', cancelarEdicion);

// ========================================
// ASOCIAR COMPROBANTE
// ========================================

const formComprobante = document.getElementById('formComprobante');

formComprobante.addEventListener('submit', async evento => {
    evento.preventDefault();

    const productoId =
        document.getElementById('productoComprobante').value;

    const nombreArchivo =
        document.getElementById('nombreArchivo').value.trim();

    const rutaArchivo =
        document.getElementById('rutaArchivo').value.trim();

    try {
        const respuesta = await peticionAPI(
            API_COMPROBANTES,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productoId: Number(productoId),
                    nombreArchivo,
                    rutaArchivo
                })
            }
        );

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarModal(
                datos.mensaje || 'No se pudo asociar el comprobante.',
                'Error'
            );
            return;
        }

        mostrarModal('Comprobante asociado correctamente.');
        formComprobante.reset();

    } catch (error) {
        console.error('Error al asociar comprobante:', error);

        mostrarModal(
            'No se pudo conectar con el servidor.',
            'Error'
        );
    }
});

// ========================================
// CONSULTAR COMPROBANTE
// ========================================

async function consultarComprobante(productoId) {
    try {
        const respuesta = await peticionAPI(
            `${API_COMPROBANTES}/${productoId}`
        );

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarModal(
                datos.mensaje || 'No se encontró el comprobante.',
                'Comprobante'
            );
            return;
        }

        mostrarModal(
            `Archivo: ${datos.nombre_archivo}\nRuta: ${datos.ruta_archivo}`,
            'Comprobante de compra'
        );

    } catch (error) {
        console.error('Error al consultar comprobante:', error);

        mostrarModal(
            'No se pudo consultar el comprobante.',
            'Error'
        );
    }
}

// ========================================
// ADMINISTRACIÓN DE AGENTES
// ========================================

const formAgente = document.getElementById('formAgente');
const listaAgentes = document.getElementById('listaAgentes');
const mensajeAgente = document.getElementById('mensajeAgente');

const botonCrearAgente = document.getElementById('botonCrearAgente');

const botonRecargarAgentes =
    document.getElementById('botonRecargarAgentes');

// Crear agente
formAgente.addEventListener('submit', async evento => {
    evento.preventDefault();

    if (!usuarioActual || usuarioActual.rol !== 'administrador') {
        mostrarModal(
            'No tienes permisos para crear agentes.',
            'Acceso denegado'
        );
        return;
    }

    const nombre = document.getElementById('nombreAgente').value.trim();
    const correo = document.getElementById('correoAgente').value.trim();
    const password = document.getElementById('passwordAgente').value;

    if (!nombre || !correo || !password) {
        mensajeAgente.textContent = 'Completa todos los campos.';
        return;
    }

    if (password.length < 8) {
        mensajeAgente.textContent =
            'La contraseña debe tener al menos 8 caracteres.';
        return;
    }

    botonCrearAgente.disabled = true;
    botonCrearAgente.textContent = 'Creando agente...';

    try {
        const respuesta = await peticionAPI(
            `${API_USUARIOS}/agentes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    correo,
                    password
                })
            }
        );

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mensajeAgente.textContent =
                datos.mensaje || 'No se pudo crear el agente.';
            return;
        }

        formAgente.reset();

        mensajeAgente.textContent =
            'Agente creado correctamente.';

        mostrarModal(
            `El agente ${datos.agente.nombre} fue creado correctamente.`,
            'Agente registrado'
        );

        await cargarAgentes();
        await cargarTickets();

    } catch (error) {
        console.error('Error al crear agente:', error);

        mensajeAgente.textContent =
            'No se pudo conectar con el servidor.';
    } finally {
        botonCrearAgente.disabled = false;
        botonCrearAgente.textContent = 'Crear agente';
    }
});

// Consultar agentes
async function cargarAgentes() {
    if (!token || !usuarioActual ||
        usuarioActual.rol !== 'administrador') {
        return;
    }

    listaAgentes.textContent = 'Cargando agentes...';

    try {
        const respuesta = await peticionAPI(
            `${API_USUARIOS}/agentes`
        );

        const agentes = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            throw new Error(
                agentes.mensaje || 'No se pudieron consultar los agentes.'
            );
        }

        agentesActuales = agentes;
        mostrarAgentes(agentesActuales);

    } catch (error) {
        console.error('Error al cargar agentes:', error);

        listaAgentes.textContent =
            'No se pudieron cargar los agentes.';
    }
}

// Mostrar agentes
function mostrarAgentes(agentes) {
    listaAgentes.innerHTML = '';

    if (!Array.isArray(agentes) || agentes.length === 0) {
        listaAgentes.textContent =
            'Todavía no hay agentes registrados.';
        return;
    }

    agentes.forEach(agente => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('producto');

        tarjeta.innerHTML = `
            <h3>${escaparHTML(agente.nombre)}</h3>

            <p><strong>ID:</strong>
                ${escaparHTML(agente.id)}
            </p>

            <p><strong>Correo:</strong>
                ${escaparHTML(agente.correo)}
            </p>

            <p><strong>Rol:</strong> Agente</p>

            <p><strong>Registro:</strong>
                ${escaparHTML(obtenerFecha(agente.fecha_registro))}
            </p>
        `;

        listaAgentes.appendChild(tarjeta);
    });
}

botonRecargarAgentes.addEventListener('click', cargarAgentes);

// ========================================
// CREAR TICKET
// ========================================

const formTicket = document.getElementById('formTicket');

formTicket.addEventListener('submit', async evento => {
    evento.preventDefault();

    const productoId =
        document.getElementById('productoTicket').value;

    const descripcion =
        document.getElementById('descripcionTicket').value.trim();

    try {
        const respuesta = await peticionAPI(
            API_TICKETS,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productoId: Number(productoId),
                    descripcion
                })
            }
        );

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarModal(
                datos.mensaje || 'No se pudo crear el ticket.',
                'Error'
            );
            return;
        }

        mostrarModal('Ticket creado correctamente.');

        formTicket.reset();
        await cargarTickets();

    } catch (error) {
        console.error('Error al crear ticket:', error);

        mostrarModal(
            'No se pudo conectar con el servidor.',
            'Error'
        );
    }
});

// ========================================
// CARGAR TICKETS
// ========================================

async function cargarTickets() {
    if (!token) return;

    const contenedor = document.getElementById('tickets');

    try {
        const respuesta = await peticionAPI(API_TICKETS);
        const tickets = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            throw new Error(
                tickets.mensaje || 'No se pudieron obtener los tickets'
            );
        }

        mostrarTickets(tickets);

    } catch (error) {
        console.error('Error al cargar tickets:', error);

        contenedor.textContent =
            'No se pudieron cargar los tickets.';
    }
}

document.getElementById('botonRecargarTickets')
    .addEventListener('click', cargarTickets);

// ========================================
// MOSTRAR TICKETS
// ========================================

function mostrarTickets(tickets) {
    const contenedor = document.getElementById('tickets');

    if (!Array.isArray(tickets) || tickets.length === 0) {
        contenedor.textContent = 'No hay tickets registrados.';
        return;
    }

    contenedor.innerHTML = '';

    tickets.forEach(ticket => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('producto');

        const esAdministrador =
            usuarioActual.rol === 'administrador';

        const puedeActualizar =
            esAdministrador || usuarioActual.rol === 'agente';

        const estado = ticket.estado || 'abierto';

        tarjeta.innerHTML = `
            <h3>Ticket #${escaparHTML(ticket.id)}</h3>

            <p><strong>Producto:</strong>
                ${escaparHTML(ticket.producto)}
            </p>

            <p><strong>Marca:</strong>
                ${escaparHTML(ticket.marca)}
            </p>

            <p><strong>Modelo:</strong>
                ${escaparHTML(ticket.modelo)}
            </p>

            <p><strong>Descripción:</strong>
                ${escaparHTML(ticket.descripcion)}
            </p>

            <p><strong>Fecha:</strong>
                ${escaparHTML(obtenerFecha(ticket.fecha_solicitud))}
            </p>

            <p><strong>Estado:</strong>
                <span class="estado-ticket">
                    ${escaparHTML(estado)}
                </span>
            </p>

            ${
                ticket.cliente
                    ? `<p><strong>Cliente:</strong> ${escaparHTML(ticket.cliente)}</p>`
                    : ''
            }

            <p class="informacion-agente">
                <strong>Agente asignado:</strong>
                ${escaparHTML(ticket.agente || 'Pendiente de asignación')}
            </p>

            ${
                esAdministrador
                    ? `
                        <div class="asignacion-ticket">
                            <label>Asignar agente:</label>

                            <select class="select-agente">
                                <option value="">Seleccionar agente</option>

                                ${agentesActuales.map(agente => `
                                    <option
                                        value="${escaparHTML(agente.id)}"
                                        ${Number(ticket.agente_id) === Number(agente.id) ? 'selected' : ''}
                                    >
                                        ${escaparHTML(agente.nombre)}
                                    </option>
                                `).join('')}
                            </select>

                            <button
                                type="button"
                                class="boton-asignar"
                            >
                                Asignar ticket
                            </button>
                        </div>
                    `
                    : ''
            }

            ${
                puedeActualizar
                    ? `
                        <div class="actualizacion-ticket">
                            <label>Actualizar estado:</label>

                            <select class="select-estado">
                                <option value="abierto"
                                    ${estado === 'abierto' ? 'selected' : ''}>
                                    Abierto
                                </option>

                                <option value="en proceso"
                                    ${estado === 'en proceso' ? 'selected' : ''}>
                                    En proceso
                                </option>

                                <option value="cerrado"
                                    ${estado === 'cerrado' ? 'selected' : ''}>
                                    Cerrado
                                </option>
                            </select>
                        </div>
                    `
                    : ''
            }
        `;

        // Evento para asignar tickets
        if (esAdministrador) {
            const selectAgente =
                tarjeta.querySelector('.select-agente');

            const botonAsignar =
                tarjeta.querySelector('.boton-asignar');

            botonAsignar.addEventListener('click', () => {
                if (!selectAgente.value) {
                    mostrarModal(
                        'Selecciona un agente antes de asignar el ticket.',
                        'Agente requerido'
                    );
                    return;
                }

                asignarTicket(
                    ticket.id,
                    selectAgente.value
                );
            });
        }

        // Evento para actualizar estados
        if (puedeActualizar) {
            const selectEstado =
                tarjeta.querySelector('.select-estado');

            selectEstado.addEventListener('change', () => {
                actualizarEstadoTicket(
                    ticket.id,
                    selectEstado.value
                );
            });
        }

        contenedor.appendChild(tarjeta);
    });
}

// ========================================
// ASIGNAR TICKET A UN AGENTE
// ========================================

async function asignarTicket(ticketId, agenteId) {
    try {
        const respuesta = await peticionAPI(
            `${API_TICKETS}/${ticketId}/asignar`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agenteId: Number(agenteId)
                })
            }
        );

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarModal(
                datos.mensaje || 'No se pudo asignar el ticket.',
                'Error'
            );
            return;
        }

        mostrarModal(
            'El ticket fue asignado correctamente al agente.',
            'Asignación exitosa'
        );

        await cargarTickets();

    } catch (error) {
        console.error('Error al asignar ticket:', error);

        mostrarModal(
            'No se pudo conectar con el servidor.',
            'Error'
        );
    }
}

// ========================================
// ACTUALIZAR ESTADO DEL TICKET
// ========================================

async function actualizarEstadoTicket(id, estado) {
    try {
        const respuesta = await peticionAPI(
            `${API_TICKETS}/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado })
            }
        );

        const datos = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarModal(
                datos.mensaje || 'No se pudo actualizar el ticket.',
                'Error'
            );

            await cargarTickets();
            return;
        }

        mostrarModal(
            'Estado del ticket actualizado correctamente.'
        );

        await cargarTickets();

    } catch (error) {
        console.error('Error al actualizar ticket:', error);

        mostrarModal(
            'No se pudo actualizar el ticket.',
            'Error'
        );
    }
}

// ========================================
// INICIAR APLICACIÓN
// ========================================

if (token && usuarioActual) {
    mostrarPanel();
} else {
    cerrarSesion();
}
