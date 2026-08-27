class Producto {
    constructor(id, nombre, marca, modelo, numeroSerie, fechaCompra, fechaFinGarantia) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.modelo = modelo;
        this.numeroSerie = numeroSerie;
        this.fechaCompra = fechaCompra;
        this.fechaFinGarantia = fechaFinGarantia;
    }
}

module.exports = Producto;