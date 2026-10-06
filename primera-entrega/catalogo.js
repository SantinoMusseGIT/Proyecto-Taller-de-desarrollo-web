const selectorCategoria = document.getElementById("categoria");
const campoBusqueda = document.getElementById("busqueda-producto");
const productos = document.querySelectorAll(".producto");
const contadorResultados = document.getElementById("cantidad-resultados");
const mensajeSinResultados = document.getElementById("sin-resultados");
const contadorCarrito = document.getElementById("cantidad-carrito");
const contadorTotalCarrito = document.getElementById("total-carrito");
const CLAVE_CARRITO = "escapeLibreCarrito";

/**
 * Obtiene los productos guardados en el carrito.
 * @method obtenerCarrito
 * @return {Array} Lista de productos almacenados.
 */
const obtenerCarrito = () => {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if (carritoGuardado === null) {
        return [];
    }

    return JSON.parse(carritoGuardado);
};

/**
 * Guarda la lista de productos del carrito.
 * @method guardarCarrito
 * @param {Array} carrito - Productos que deben almacenarse.
 * @return {void}
 */
const guardarCarrito = (carrito) => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
};

/**
 * Actualiza la cantidad y el total mostrados en el encabezado.
 * @method actualizarResumenCarrito
 * @return {void}
 */
const actualizarResumenCarrito = () => {
    const carrito = obtenerCarrito();

    const cantidad = carrito.reduce(
        (acumulador, producto) => acumulador + producto.cantidad,
        0
    );

    const total = carrito.reduce(
        (acumulador, producto) =>
            acumulador + producto.precio * producto.cantidad,
        0
    );

    contadorCarrito.textContent = cantidad;
    contadorTotalCarrito.textContent = total.toLocaleString("es-AR");
};

actualizarResumenCarrito();
/**
 * Filtra los productos según la categoría y el texto ingresado.
 * @method aplicarFiltros
 * @return {void}
 */
const aplicarFiltros = () => {
    const categoriaSeleccionada = selectorCategoria.value;
    const textoBuscado = campoBusqueda.value.trim().toLowerCase();
    const patronBusqueda = /^[a-záéíóúüñ\s]*$/;
    const busquedaValida = patronBusqueda.test(textoBuscado);
    if (!busquedaValida) {
        alert("La búsqueda solo puede contener letras y espacios.");
        campoBusqueda.value = "";
        return;
    }

    let cantidadVisible = 0;

    productos.forEach((producto) => {
        const coincideCategoria =
            categoriaSeleccionada === "" ||
            producto.dataset.categoria === categoriaSeleccionada;

        const nombreProducto = producto
            .querySelector("h4")
            .textContent
            .toLowerCase();

        const coincideBusqueda =
            textoBuscado === "" ||
            nombreProducto.includes(textoBuscado);

        const debeMostrarse = coincideCategoria && coincideBusqueda;
        producto.hidden = !debeMostrarse;

        if (debeMostrarse) {
            cantidadVisible += 1;
        }
    });

    const palabraResultado =
        cantidadVisible === 1 ? "resultado" : "resultados";

    contadorResultados.textContent =
        `${cantidadVisible} ${palabraResultado}`;

    mensajeSinResultados.hidden = cantidadVisible !== 0;
};

const parametrosBusqueda =
    new URLSearchParams(window.location.search);

const busquedaDesdeUrl =
    parametrosBusqueda.get("busqueda");

if (busquedaDesdeUrl !== null) {
    campoBusqueda.value = busquedaDesdeUrl;
    aplicarFiltros();
}

/**
 * Agrega un producto al carrito guardado y actualiza el resumen.
 * Si el producto ya existe, aumenta su cantidad.
 * @method agregarAlCarrito
 * @param {HTMLButtonElement} boton - Botón del producto seleccionado.
 * @return {void}
 */
const agregarAlCarrito = (boton) => {
    const tarjetaProducto = boton.closest(".producto");

    const idProducto = tarjetaProducto.dataset.id;
    const nombreProducto = tarjetaProducto
        .querySelector("h4")
        .textContent
        .trim();
    const precioProducto = Number(tarjetaProducto.dataset.precio);
    const imagenProducto = tarjetaProducto
        .querySelector("img")
        .getAttribute("src");

    const carrito = obtenerCarrito();

    const productoExistente = carrito.find(
        (producto) => producto.id === idProducto
    );

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: idProducto,
            nombre: nombreProducto,
            precio: precioProducto,
            imagen: imagenProducto,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    actualizarResumenCarrito();

    alert(`${nombreProducto} fue agregado al carrito.`);
};