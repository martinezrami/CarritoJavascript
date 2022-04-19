class Maquina {
    constructor(maquina) {
        this.id = maquina.id;
        this.nombre = maquina.nombre;
        this.precio = maquina.precio;
        this.cantidad = 1;
    }

    sumarUnidad() {
        return this.cantidad++;
    }

    restarUnidad() {
        return this.cantidad--;
    }
}
