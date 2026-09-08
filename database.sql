-- ============================================
-- WARRANTYHUB - BASE DE DATOS
-- ============================================

-- Tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100) NOT NULL UNIQUE,
    fecha_compra DATE NOT NULL,
    fecha_fin_garantia DATE NOT NULL
);


-- Tabla de comprobantes
CREATE TABLE comprobantes (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comprobante_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
        ON DELETE CASCADE
);


-- Tabla de tickets
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'abierto',

    CONSTRAINT fk_ticket_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
        ON DELETE CASCADE,

    CONSTRAINT check_estado_ticket
        CHECK (estado IN ('abierto', 'en proceso', 'cerrado'))
);