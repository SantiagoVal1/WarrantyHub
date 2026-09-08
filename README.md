# WarrantyHub

Sistema de gestión de garantías y reclamos.

## Descripción

WarrantyHub es una aplicación web desarrollada como proyecto integrador para facilitar la gestión de productos con garantía, comprobantes de compra y tickets de reclamo.

El sistema permite registrar productos, consultar y editar su información, asociar comprobantes de compra y gestionar tickets de reclamo relacionados con los productos.

## Funcionalidades del MVP

### 1. Gestión de productos con garantía
- Registrar productos.
- Consultar productos registrados.
- Editar productos.
- Mostrar si la garantía está activa o vencida.

### 2. Gestión de comprobantes de compra
- Asociar un comprobante de compra a un producto.
- Consultar el comprobante asociado.

### 3. Sistema de tickets de reclamo
- Crear tickets de reclamo.
- Consultar tickets registrados.
- Actualizar el estado de los tickets.

Estados disponibles:
- Abierto
- En proceso
- Cerrado

## Tecnologías utilizadas

- JavaScript
- Node.js
- Express
- PostgreSQL
- Neon
- HTML
- CSS
- Postman
- Git
- GitHub
- Trello
- Visual Studio Code

## Arquitectura

El proyecto utiliza una arquitectura sencilla por capas.

**Frontend → API REST → Routes → Controllers → Services → PostgreSQL/Neon**

- **Frontend:** interfaz web con HTML, CSS y JavaScript.
- **Routes:** define las rutas de la API.
- **Controllers:** recibe peticiones y devuelve respuestas.
- **Services:** contiene la lógica de las operaciones.
- **Models:** representa productos, comprobantes y tickets.
- **Database:** realiza la conexión con PostgreSQL.
- **Neon:** aloja la base de datos PostgreSQL.

## Estructura del proyecto

```text
WarrantyHub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── comprobanteController.js
│   │   │   ├── productoController.js
│   │   │   └── ticketController.js
│   │   ├── models/
│   │   │   ├── comprobante.js
│   │   │   ├── producto.js
│   │   │   └── ticket.js
│   │   ├── routes/
│   │   │   ├── comprobanteRoutes.js
│   │   │   ├── productoRoutes.js
│   │   │   └── ticketRoutes.js
│   │   └── services/
│   │       ├── comprobanteService.js
│   │       ├── productoService.js
│   │       └── ticketService.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── postman/
├── .gitignore
├── package.json
└── package-lock.json
```

`node_modules` no se incluye en el repositorio porque está excluido mediante `.gitignore`.

## Requisitos

- Node.js
- PostgreSQL
- Cuenta o conexión de PostgreSQL mediante Neon
- Git (opcional, para clonar el repositorio)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/SantiagoVal1/WarrantyHub.git
cd WarrantyHub
npm install
```

## Configuración

Crear un archivo `.env` dentro de `backend`:

```env
DATABASE_URL=tu_conexion_de_postgresql
```

No subir las credenciales reales al repositorio.

## Base de datos

El proyecto utiliza PostgreSQL. La tabla principal de productos se crea con:

```sql
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100) NOT NULL UNIQUE,
    fecha_compra DATE NOT NULL,
    fecha_fin_garantia DATE NOT NULL
);
```

Las tablas de comprobantes y tickets se relacionan con los productos mediante `producto_id`.

## Ejecución

Desde la carpeta principal:

```bash
node backend/server.js
```

El servidor queda disponible en:

```text
http://localhost:3000
```

## API

### Productos

```text
POST /api/productos
GET  /api/productos
PUT  /api/productos/:id
```

### Comprobantes

```text
POST /api/comprobantes
GET  /api/comprobantes/:productoId
```

### Tickets

```text
POST /api/tickets
GET  /api/tickets
PUT  /api/tickets/:id
```

## Historias de usuario del MVP

- **HU-01:** Registrar productos con garantía.
- **HU-02:** Consultar productos.
- **HU-03:** Editar productos.
- **HU-04:** Asociar comprobantes de compra.
- **HU-05:** Consultar comprobantes.
- **HU-06:** Crear tickets de reclamo.
- **HU-07:** Consultar tickets.
- **HU-08:** Actualizar el estado de los tickets.

## Pruebas

Las API fueron probadas mediante Postman y posteriormente las funcionalidades fueron comprobadas desde el frontend.

Se verificaron:
- Registro, consulta y edición de productos.
- Validaciones de productos.
- Asociación y consulta de comprobantes.
- Creación y consulta de tickets.
- Actualización de estados.
- Funcionamiento del frontend.

El flujo de estados probado fue:

```text
Abierto → En proceso → Cerrado
```

## Control de versiones

El proyecto utiliza Git y GitHub.

Repositorio:

https://github.com/SantiagoVal1/WarrantyHub

El `.gitignore` evita subir `node_modules` y las variables de entorno.

## Gestión

El desarrollo se organizó mediante Trello.

## Funcionalidades futuras

Estas funciones quedan para futuras versiones:

- Asignación de tickets a agentes.
- Portal de cliente.
- Notificaciones por correo.
- Dashboard de administración.
- Administración de usuarios.
- Inicio de sesión.
- Integración con sistemas externos.
- Chat en tiempo real.
- Inteligencia artificial.
- Aplicación móvil.

## Estado actual

El MVP de WarrantyHub se encuentra funcional.

Las tres funcionalidades principales implementadas son:

1. Gestión de productos con garantía.
2. Gestión de comprobantes de compra.
3. Sistema de tickets de reclamo.

## Autor

**Santiago Valencia**

Proyecto Integrador II — 2026
