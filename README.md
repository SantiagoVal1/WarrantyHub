# WarrantyHub

**Sistema de gestión de garantías y reclamos.**

## Descripción

WarrantyHub es una aplicación web desarrollada como Proyecto Integrador
II para facilitar la gestión de productos con garantía, comprobantes de
compra y tickets de reclamo.

El sistema permite registrar productos, consultar y editar su
información, asociar comprobantes de compra y gestionar reclamos
relacionados con los productos. También incorpora autenticación de
usuarios, control de acceso por roles, administración de agentes y
asignación de tickets.

## Funcionalidades implementadas

### 1. Gestión de productos con garantía

-   Registrar productos.
-   Consultar productos registrados.
-   Editar productos.
-   Mostrar si la garantía está activa o vencida.
-   Restringir las operaciones de acuerdo con el usuario autenticado y
    los permisos de su rol.

### 2. Gestión de comprobantes de compra

-   Asociar un comprobante de compra a un producto.
-   Consultar el comprobante asociado al producto.
-   Validar que el usuario tenga autorización para operar sobre el
    producto relacionado.

### 3. Sistema de tickets de reclamo

-   Crear tickets de reclamo asociados a productos.
-   Consultar tickets registrados.
-   Actualizar el estado de los tickets.
-   Asignar tickets a agentes desde la cuenta de administrador.
-   Mostrar al agente únicamente los tickets que tiene asignados.
-   Permitir que el agente actualice el estado de sus tickets asignados.

Estados disponibles: - Abierto - En proceso - Cerrado

### 4. Registro e inicio de sesión

-   Registrar cuentas de clientes.
-   Iniciar sesión con correo y contraseña.
-   Proteger las contraseñas mediante hash con bcrypt.
-   Autenticar las solicitudes protegidas mediante tokens JWT.

### 5. Administración de agentes

-   Crear cuentas de agentes desde la cuenta de administrador.
-   Consultar la lista de agentes registrados.
-   Asignar tickets a agentes.
-   Validar que el usuario seleccionado para una asignación tenga el rol
    de agente.

### 6. Control de acceso por roles

WarrantyHub maneja tres roles:

  -----------------------------------------------------------------------
  Rol                                 Permisos principales
  ----------------------------------- -----------------------------------
  **Administrador**                   Gestionar productos y comprobantes,
                                      consultar los tickets del sistema,
                                      crear y consultar agentes, asignar
                                      tickets y actualizar estados.

  **Agente**                          Consultar los tickets asignados a
                                      su cuenta y actualizar el estado de
                                      esos tickets. No puede crear
                                      agentes ni asignar tickets.

  **Cliente**                         Registrarse e iniciar sesión,
                                      gestionar sus propios productos y
                                      comprobantes, crear reclamos y
                                      consultar sus propios tickets.
  -----------------------------------------------------------------------

La autorización se valida en el backend mediante middleware. La interfaz
también adapta las secciones visibles según el rol, pero ocultar una
sección en el frontend no sustituye la protección de las rutas de la
API.

## Tecnologías utilizadas

-   **Lenguaje:** JavaScript
-   **Backend:** Node.js y Express
-   **Autenticación:** JSON Web Token (JWT)
-   **Hash de contraseñas:** bcrypt
-   **Base de datos:** PostgreSQL
-   **Alojamiento de base de datos:** Neon
-   **Frontend:** HTML, CSS y JavaScript
-   **Pruebas de API:** Postman
-   **Control de versiones:** Git y GitHub
-   **Gestión del proyecto:** Trello
-   **Diagramas:** Draw.io
-   **Editor:** Visual Studio Code

## Arquitectura

El proyecto utiliza una arquitectura por capas:

**Frontend → API REST → Routes → Controllers → Services →
PostgreSQL/Neon**

-   **Frontend:** interfaz web desarrollada con HTML, CSS y JavaScript.
    Presenta las funcionalidades permitidas para cada rol.
-   **Routes:** define los endpoints de la API y aplica los middleware
    de autenticación y autorización.
-   **Controllers:** recibe las peticiones, valida los datos de entrada
    y devuelve las respuestas HTTP.
-   **Services:** contiene la lógica de negocio, las consultas y las
    reglas de propiedad y asignación.
-   **Models:** carpeta destinada a las estructuras de las entidades del
    sistema.
-   **Middleware:** verifica los tokens JWT y los roles autorizados para
    las rutas protegidas.
-   **Database:** administra la conexión con PostgreSQL.
-   **Neon:** aloja la base de datos PostgreSQL.

## Estructura del proyecto

``` text
WarrantyHub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── comprobanteController.js
│   │   │   ├── productoController.js
│   │   │   ├── ticketController.js
│   │   │   └── usuarioController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── comprobanteRoutes.js
│   │   │   ├── productoRoutes.js
│   │   │   ├── ticketRoutes.js
│   │   │   └── usuarioRoutes.js
│   │   └── services/
│   │       ├── comprobanteService.js
│   │       ├── productoService.js
│   │       ├── ticketService.js
│   │       └── usuarioService.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── postman/
├── .gitignore
├── database.sql
├── package.json
├── package-lock.json
└── README.md
```

`node_modules` no se incluye en el repositorio porque está excluido
mediante `.gitignore`.

## Requisitos

-   Node.js y npm.
-   Una base de datos PostgreSQL.
-   Una cuenta o conexión de PostgreSQL mediante Neon.
-   Git (opcional, para clonar el repositorio).

## Instalación

Clonar el repositorio:

``` bash
git clone https://github.com/SantiagoVal1/WarrantyHub.git
cd WarrantyHub
```

Instalar las dependencias:

``` bash
npm install
```

## Configuración

Crear el archivo `.env` dentro de la carpeta `backend`:

``` env
DATABASE_URL=tu_conexion_de_postgresql
JWT_SECRET=define_un_secreto_seguro
JWT_EXPIRES_IN=1d
```

-   `DATABASE_URL`: cadena de conexión de PostgreSQL/Neon.
-   `JWT_SECRET`: secreto utilizado para firmar y verificar los tokens
    JWT.
-   `JWT_EXPIRES_IN`: tiempo de expiración del token.

**Importante:** reemplazar los valores de ejemplo por los valores
propios del entorno. No publicar el archivo `.env`, contraseñas, tokens
ni cadenas de conexión en GitHub. El archivo debe permanecer excluido
mediante `.gitignore`.

## Base de datos

El proyecto utiliza PostgreSQL alojado en Neon. El archivo
`database.sql` contiene el esquema de la base de datos del proyecto.

Las entidades principales son:

-   **usuarios:** almacena las cuentas, credenciales protegidas y roles
    (`administrador`, `agente` y `cliente`).
-   **productos:** almacena la información de los productos y su
    garantía, y se relaciona con el usuario propietario.
-   **comprobantes:** almacena los comprobantes asociados a productos.
-   **tickets:** almacena los reclamos asociados a productos y usuarios,
    e incluye la información de asignación al agente y el estado del
    ticket.

Las relaciones permiten controlar la propiedad de los productos y
reclamos, así como filtrar los tickets que corresponden a cada agente.

## Ejecución

Desde la carpeta principal del proyecto, ejecutar:

``` bash
node backend/server.js
```

El servidor queda disponible en:

``` text
http://localhost:3000
```

Para utilizar la aplicación, mantener abierta la terminal mientras el
servidor esté en ejecución y abrir la dirección anterior en el
navegador.

## API

Las rutas protegidas requieren un token JWT válido en el encabezado de
autorización:

``` text
Authorization: Bearer <token>
```

### Usuarios y autenticación

  Método   Endpoint                   Descripción             Acceso
  -------- -------------------------- ----------------------- ---------------
  POST     `/api/usuarios/registro`   Registrar un cliente.   Público
  POST     `/api/usuarios/login`      Iniciar sesión.         Público
  POST     `/api/usuarios/agentes`    Crear un agente.        Administrador
  GET      `/api/usuarios/agentes`    Consultar agentes.      Administrador

El registro público crea cuentas con rol de cliente. Las cuentas de
agente se crean desde la funcionalidad protegida para el administrador.

### Productos

  -----------------------------------------------------------------------
  Método                  Endpoint                Descripción
  ----------------------- ----------------------- -----------------------
  POST                    `/api/productos`        Registrar un producto.

  GET                     `/api/productos`        Consultar productos
                                                  permitidos para el
                                                  usuario autenticado.

  PUT                     `/api/productos/:id`    Actualizar un producto
                                                  autorizado.
  -----------------------------------------------------------------------

### Comprobantes

  ---------------------------------------------------------------------------------
  Método                  Endpoint                          Descripción
  ----------------------- --------------------------------- -----------------------
  POST                    `/api/comprobantes`               Asociar un comprobante
                                                            a un producto.

  GET                     `/api/comprobantes/:productoId`   Consultar el
                                                            comprobante de un
                                                            producto.
  ---------------------------------------------------------------------------------

### Tickets

  ----------------------------------------------------------------------------------
  Método            Endpoint                     Descripción       Acceso
  ----------------- ---------------------------- ----------------- -----------------
  POST              `/api/tickets`               Crear un ticket   Administrador y
                                                 de reclamo.       cliente

  GET               `/api/tickets`               Consultar tickets Administrador,
                                                 según el rol y    agente y cliente
                                                 las asignaciones. 

  PUT               `/api/tickets/:id`           Actualizar el     Administrador y
                                                 estado de un      agente asignado
                                                 ticket            
                                                 autorizado.       

  PUT               `/api/tickets/:id/asignar`   Asignar un ticket Administrador
                                                 a un agente.      
  ----------------------------------------------------------------------------------

Los permisos efectivos se aplican en el backend. El sistema limita la
consulta de los clientes a sus propios tickets y la consulta de los
agentes a los tickets asignados a sus cuentas.

## Historias de usuario implementadas

-   **HU-01:** Registrar productos con garantía.
-   **HU-02:** Consultar productos.
-   **HU-03:** Editar productos.
-   **HU-04:** Asociar comprobantes de compra.
-   **HU-05:** Consultar comprobantes.
-   **HU-06:** Crear tickets de reclamo.
-   **HU-07:** Consultar tickets.
-   **HU-08:** Actualizar el estado de los tickets.
-   **HU-09:** Asignar tickets a agentes.
-   **HU-12:** Registrar usuarios e iniciar sesión.
-   **HU-13:** Crear y consultar agentes desde la cuenta de
    administrador.
-   **HU-14:** Restringir el acceso a las funcionalidades según el rol.
-   **HU-15:** Limitar el acceso a productos y tickets según la
    propiedad y la asignación.

## Pruebas

Las API fueron probadas mediante Postman y las funcionalidades también
fueron comprobadas desde el frontend.

Se realizaron comprobaciones de:

-   Registro, consulta y edición de productos.
-   Validación de campos obligatorios, números de serie y fechas de
    garantía.
-   Asociación y consulta de comprobantes.
-   Registro e inicio de sesión.
-   Creación y consulta de agentes desde el administrador.
-   Creación, consulta y actualización de tickets.
-   Asignación de tickets a agentes.
-   Consulta de tickets según el rol y la asignación.
-   Restricciones de acceso a rutas protegidas.
-   Funcionamiento de la interfaz para los distintos roles.

Flujo de estados de los tickets:

``` text
Abierto → En proceso → Cerrado
```

## Control de versiones

El proyecto utiliza Git y GitHub para almacenar el código y controlar
los cambios.

Repositorio:

<https://github.com/SantiagoVal1/WarrantyHub>

El archivo `.gitignore` evita subir `node_modules` y las variables de
entorno con credenciales.

## Gestión del proyecto

El desarrollo se organizó mediante Trello, utilizando listas para
clasificar las tareas pendientes, las que se encontraban en desarrollo y
las completadas.

## Funcionalidades futuras

Las siguientes funcionalidades no forman parte de la versión
implementada y pueden considerarse para futuras mejoras:

-   Notificaciones automáticas por correo electrónico.
-   Dashboard estadístico independiente para administración.
-   Integración con sistemas externos.
-   Chat en tiempo real.
-   Funcionalidades basadas en inteligencia artificial.
-   Aplicación móvil.

## Estado actual

WarrantyHub cuenta con una versión funcional que integra:

1.  Gestión de productos con garantía.
2.  Gestión de comprobantes de compra.
3.  Sistema de tickets de reclamo.
4.  Registro e inicio de sesión.
5.  Administración de agentes.
6.  Asignación de tickets.
7.  Control de acceso por roles: administrador, agente y cliente.

Las funcionalidades implementadas fueron comprobadas desde el frontend y
mediante pruebas de API. Las mejoras indicadas en la sección de
funcionalidades futuras quedan fuera del alcance de esta versión.

Antes de desplegar el sistema en un entorno de producción, se recomienda
realizar una revisión adicional de seguridad, especialmente de la
vigencia de los roles asociados a los tokens, la expiración de sesiones
y las pruebas de acceso no autorizado.

## Autor

**Santiago Valencia**

Proyecto Integrador II --- 2026
