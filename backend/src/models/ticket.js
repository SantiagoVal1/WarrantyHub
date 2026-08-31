class Ticket {

    constructor(
        id,
        productoId,
        descripcion,
        fechaSolicitud,
        estado
    ) {
        this.id = id;
        this.productoId = productoId;
        this.descripcion = descripcion;
        this.fechaSolicitud = fechaSolicitud;
        this.estado = estado;
    }

}

module.exports = Ticket;