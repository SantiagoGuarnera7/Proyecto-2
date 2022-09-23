class Producto {
    constructor(id, nombre, precio, foto) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }
}

class ElementoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}


// Definiciones de constantes

const estandarDolaresAmericanos = Intl.NumberFormat('en-US');

//Arrays donde guardaremos catálogo de productos y elementos en carrito
const productos = [];
const elementosCarrito = [];
const contenedorProductos = document.getElementById('contenedor-productos');

const contenedorCarritoCompras = document.querySelector("#items")

const contenedorFooterCarrito = document.querySelector("#footer");


// Ejecución de funciones


cargarProductos();
cargarCarrito();
dibujarCatalogoProductos();


// Definiciones de funciones


function cargarProductos() {
    productos.push(new Producto(1, 'Pantalon', 2800, '../img/pantalonhombre.jpg'));
    productos.push(new Producto(2, 'Remera', 1500, '../img/remera negra.jpg'));
    productos.push(new Producto(3, 'Zapatillas', 13000, '../img/zapaMujer.jpg'));
    productos.push(new Producto(4, 'Buzo', 3600, '../img/buzodama.jpg'));
    productos.push(new Producto(5, 'Campera', 8500, '../img/campera hombre.webp'));
    productos.push(new Producto(6, 'Zapatillas', 20000, '../img/zapatillasNike.jpg'));
    productos.push(new Producto(7, 'Vestido', 2900, '../img/vestidomuj.jpg'));
    productos.push(new Producto(8, 'Buzo Hombre', 6500, '../img/buzohomb.jpg'));
    productos.push(new Producto(9, 'Campera Nike', 15000, '../img/camperaNike.jpg'));
}

function cargarCarrito() {

}

function dibujarCarrito() {
    contenedorCarritoCompras.innerHTML = "";

    elecarrito = JSON.parse(localStorage.getItem('productos'));

    elecarrito.forEach(
        (elemento) => {
            let renglonesCarrito = document.createElement("tr");

            renglonesCarrito.innerHTML = `
                        <td>${elemento.producto.id}</td>
                        <td>${elemento.producto.nombre}</td>
                        <td><input id="cantidad-producto-${elemento.producto.id}" type="number" value="${elemento.cantidad}" min="1" max="1000" step="1" style="width: 50px;"/></td>
                        <td>$ ${elemento.producto.precio}</td>
                        <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio * elemento.cantidad)}</td>
                        <td><botton id="eliminar-producto-${elemento.producto.id}" type ="button" class="btn btn-danger"><i class="bi bi-trash-fill"</button></td>

                    `;

            contenedorCarritoCompras.append(renglonesCarrito);


            //Agregar evento a input de renglon en carrito
            let inputCantidadProducto = document.getElementById(`cantidad-producto-${elemento.producto.id}`);
            inputCantidadProducto.addEventListener('change', (ev) => {
                let nuevaCantidad = ev.target.value;
                elemento.cantidad = nuevaCantidad;

                dibujarCarrito();
            });


            //agregar evento a eliminar producto
            let botonEliminarProducto = document.getElementById(`eliminar-producto-${elemento.producto.id}`);
            botonEliminarProducto.addEventListener('click', () => {


                let indiceEliminar = elecarrito.indexOf(elemento);
                elecarrito.splice(indiceEliminar, 1);

                localStorage.setItem('productos', JSON.stringify(elecarrito));
                dibujarCarrito();
            });
        }
    );

    const valorInicial = 0;
    const totalComprar = elecarrito.reduce(
        (previusValue, currentValue) => previusValue + currentValue.producto.precio * currentValue.cantidad, valorInicial
    );

    if (elecarrito.length === 0) {
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Carrito vacio - comience a comprar!</th>`;
    } else {
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Total de la compra: ${totalComprar}</th>`;
    }

}

function removerProductoCarrito(elementoAEliminar) {


    let carrito = JSON.parse(localStorage.getItem('productos'));
    const elementosAMantener = carrito.filter((elemento) => elementoAEliminar.producto.id != elemento.producto.id);
    carrito.length = 0;

    elementosAMantener.forEach((elemento) => carrito.push(elemento));

    localStorage.setItem('productos', carrito)
}

function crearCard(producto) {
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-warning";
    botonAgregar.innerText = "Agregar";

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <p>$ ${producto.precio} ARS</p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;

    //Card
    let carta = document.createElement("div");
    carta.className = "card m-2 p-2";
    carta.style = "width: 18rem";
    carta.append(imagen);
    carta.append(cuerpoCarta);



    //Agregar algunos eventos
    botonAgregar.onclick = () => {
        let elementoExistente = elementosCarrito.find((elem) => elem.producto.id == producto.id);


        if (elementoExistente) {
            elementoExistente.cantidad += 1;

            this.guardarLocalStorage(elementoExistente);
        } else {
            let elementoCarrito = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elementoCarrito);

            this.guardarLocalStorage(elementoCarrito);
        }
            dibujarCarrito();

        swal({
            title: 'Articulo agregado al Carrito',
            text: `${producto.nombre} $ ${producto.precio}`,
            icon: 'success',
            buttons: {
                cerrar: {
                    text: "cerrar",
                    value: false
                },
                carrito: {
                    text: "ir al carrito",
                    value: true
                }
            }
        }).then((decision) => {
            if (decision) {
                const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), { keyboard: true });
                const modalToggle = document.getElementById('toggleMyMosal');
                myModal.show(modalToggle);
            } else {
                swal("No quiero ir al carrito");
            }
        });

    }

    return carta;

}

function dibujarCatalogoProductos() {
    contenedorProductos.innerHTML = "";

    productos.forEach(
        (producto) => {
            let contenedorCarta = crearCard(producto);
            contenedorProductos.append(contenedorCarta);
        }
    );


}


function guardarLocalStorage(elemento) {
    let articulos;
    articulos = this.obtenerLocalStorage(elemento);

    let verificarExistencia = false;
    articulos.map(item => {
        if (elemento.producto.id === item.producto.id) {
            item.cantidad = item.cantidad + 1;
            verificarExistencia = true;
        }
    })

    if (!verificarExistencia) {
        articulos.push(elemento);
    }

    localStorage.setItem('productos', JSON.stringify(articulos));
}

function obtenerLocalStorage() {
    let articuloLS;

    if (localStorage.getItem('productos') === null) {
        articuloLS = [];
    } else {
        articuloLS = JSON.parse(localStorage.getItem('productos'));
    }
    return articuloLS;
};