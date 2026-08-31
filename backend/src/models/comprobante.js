class Comprobante {

    constructor(
        id,
        productoId,
        nombreArchivo,
        rutaArchivo,
        fechaRegistro
    ) {
        this.id = id;
        this.productoId = productoId;
        this.nombreArchivo = nombreArchivo;
        this.rutaArchivo = rutaArchivo;
        this.fechaRegistro = fechaRegistro;
    }

}

module.exports = Comprobante;