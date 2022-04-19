// Funciones ----
async function obtenerDatos() {
    let nodoCartas = document.querySelector("#cartas");

    let datos = await fetch("./data/datos.json");
    let productos = await datos.json();

    nodoCartas.innerHTML = "";
    await cargarCartas(productos);
}

function cargarCartas() {
    let nodoCartas = document.querySelector("#cartas");

    fetch("./data/datos.json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((maquina) => {
                let tarjetas = document.createElement("div");
                tarjetas.innerHTML = `
        <div class="card text-center d-flex justify-content-center" style="width: 18rem;">
        <div class="card-body">
        <img src="${maquina.img}" id="" class="card-img-top img-fluid" alt="">
        <h2 class="card-title">${maquina.nombre}</h2>
        <p class="card-text">$${maquina.precio}</p>
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button id="agregarMaquina${maquina.id}" type="button" class="btn btn-primary"> Añadir </button>
        </div>
        </div>
        </div>`;

                nodoCartas.appendChild(tarjetas);

                let btnAgregar = document.querySelector(`#agregarMaquina${maquina.id}`);

                // btnAgregar.onclick = () => agregarProductos(maquina.id);
                btnAgregar.addEventListener("click", () => {
                    agregarProductos(maquina.id, data),
                        Toastify({
                            text: `${maquina.nombre} al carrito`,
                            duration: 2000,
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                });
            });
        });
}

function chequearStorage() {
    let carritoCargado = JSON.parse(localStorage.getItem("carritoCargado"));

    if (carritoCargado) {
        let carritoEnStorage = [];
        for (let i = 0; i < carritoCargado.length; i++) {
            carritoEnStorage.push(new Maquina(carritoCargado[i]));
        }
        return carritoEnStorage;
    } else {
        return [];
    }
}

function agregarProductos(idMaquina, data) {
    let maquinaAgregada = carrito.find((element) => element.id == idMaquina);

    if (maquinaAgregada) {
        let mapeo = carrito.map((element) => element.id);
        let indiceProducto = mapeo.findIndex((element) => element === maquinaAgregada.id);

        carrito[indiceProducto].sumarUnidad();
    } else {
        let agregarProducto = new Maquina(data[idMaquina]);
        carrito = [...carrito, agregarProducto];
    }

    localStorage.setItem("carritoCargado", JSON.stringify(carrito));
    completarTabla(carrito);
}

function eliminarProducto(id) {
    let producto = carrito.find((producto) => producto.id == id);
    let index = carrito.findIndex((elemento) => {
        if (elemento.id === producto.id) {
            return true;
        }
    });
    if (producto.cantidad > 1) {
        carrito[index].restarUnidad();
    } else {
        carrito.splice(index, 1);
    }
    localStorage.setItem("carritoCargado", JSON.stringify(carrito));
    completarTabla(carrito);
}

function completarTabla() {
    let tablaVacia = document.querySelector("#carritoCompras");
    tablaVacia.innerHTML = "";

    let precioFinal = calcularPrecioFinal(carrito);

    let tabla = document.createElement("div");
    tabla.innerHTML = `<table id=tablaCarrito class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Maquina</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col"></th>
                                    <th scope="col">Precio</th>
                                </tr>
                            </thead>
                            <tbody id=bodyTablaCarrito> 
                            
                            </tbody>
                        </table>
                        <p><b>TOTAL: $${precioFinal}</b></p>`;

    tablaVacia.appendChild(tabla);

    let tablaBody = document.querySelector("#bodyTablaCarrito");
    let btnVaciar = document.querySelector("#vaciarCarrito");
    btnVaciar.addEventListener("click", vaciarCarrito);

    carrito.forEach((element) => {
        let dibujarMaquina = document.createElement("tr");
        dibujarMaquina.innerHTML = "";
        dibujarMaquina.innerHTML = `
                        <td>${element.nombre}</td>
                        <td style="text-align: center;">${element.cantidad}</td>
                        <button id="eliminar${element.id}" type="button" class="btn btn-outline-danger btn-sm">-</button>
                        <td>$${element.precio}</td>
                        `;

        tablaBody.appendChild(dibujarMaquina);
        let restarUnidad = document.getElementById(`eliminar${element.id}`);
        restarUnidad.addEventListener("click", () => {
            eliminarProducto(element.id);
        });
    });
}

function calcularPrecioFinal(carrito) {
    let precioFinal = 0;

    for (const maquina of carrito) {
        precioFinal += maquina.precio * maquina.cantidad;
    }
    return precioFinal;
}

function vaciarCarrito() {
    carrito = [];
    localStorage.clear();
    completarTabla(carrito);
}

// Invocacion de funciones ----

cargarCartas();
chequearStorage();
carrito = chequearStorage();
completarTabla(carrito);
